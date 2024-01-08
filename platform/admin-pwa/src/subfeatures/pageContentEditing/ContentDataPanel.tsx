import React, {useState} from 'react';
import {get, set} from 'lodash-es';
import {Card, CardContent} from '@/components/ui/card';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {setSessionState, useSessionState} from '@/utils/localStorage';
import {
    ContentDataConfigClass,
    ContentDataBlockClass,
    ContentDataFieldClass
} from 'infra-common/data/ContentDataConfig';
import {Label} from '@/components/ui/label';
import {ContentData, ContentDataBlock, ContentDataField} from 'infra-common/data/ContentData';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    LucideSettings,
    LucideMinus,
    LucidePlus
} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {CodeEditorJson} from '@/components/utils/CodeEditorJson';
import {buildOrUpdateContentObject} from '@/utils/PageUtils';
import {PageData} from '@/data/PageData';
import {IndexPositionBadge} from '@/components/utils/IndexPositionBadge';
import {arrayMove} from '@/utils/arrayUtils';
import {ControlText} from '@/subfeatures/pageContentEditing/ControlText';
import {ControlImage} from '@/subfeatures/pageContentEditing/ControlImage';
import {ControlTipTap} from '@/subfeatures/pageContentEditing/ControlTipTap';

interface ContentDataPanelProps {
    sessionStateKey: string;
    isInAction?: boolean;
    actionData: any;
}

export function ContentDataPanel(props: ContentDataPanelProps) {
    const {sessionStateKey, isInAction, actionData} = props;
    const [isDataConfigMode, setDataConfigMode] = useState<boolean>(false);
    const [uniqueValue, setUniqueValue] = useState<number>(0);
    const {value: pageData} = useSessionState<PageData>(sessionStateKey);

    if (!pageData?.pageEntry.Content) {
        return (
            <div>
                <p>Missing Initial Data For Content Data</p>
            </div>
        );
    }

    const {Content} = pageData.pageEntry;

    const handleSubmitConfig = (code: string) => {
        if (Content) {
            try {
                const newContentDataConfigClass = JSON.parse(code);
                const prevContentData = JSON.parse(Content?.ContentData.S);
                const newContentData: ContentData = buildOrUpdateContentObject(
                    newContentDataConfigClass,
                    prevContentData
                );
                Content.ContentData.S = JSON.stringify(newContentData);
                Content.ContentDataConfig.S = code;
                setSessionState(sessionStateKey, pageData);
                setDataConfigMode(false);
            } catch (e: any) {
                // do nothing
            }
        }
    };

    let contentDataConfigClass: ContentDataConfigClass = [];
    let contentData: ContentData = {};
    let contentDataError = '';
    try {
        contentDataConfigClass = JSON.parse(Content?.ContentDataConfig.S);
    } catch (e: any) {
        contentDataError = 'Error parsing the content data configuration. Please double check the Config settings.';
    }
    try {
        contentData = JSON.parse(Content?.ContentData.S);
    } catch (e: any) {
        contentDataError = 'Error parsing the content data values.';
    }

    const handleContentDataChange = (newContentData: ContentData, doRefresh?: boolean) => {
        if (Content) {
            Content.ContentData.S = JSON.stringify(newContentData);
            setSessionState(sessionStateKey, pageData);
            if (doRefresh) {
                setUniqueValue(uniqueValue + 1);
            }
        }
    };

    const handleAddNewBlock = (code: string, blockIndex: number) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (Content) {
            const prevContentData = JSON.parse(Content?.ContentData.S);
            (prevContentData[code] as Array<ContentDataBlock>).splice(blockIndex, 0, {});
            const newContentData: ContentData = buildOrUpdateContentObject(
                contentDataConfigClass,
                prevContentData
            );
            Content.ContentData.S = JSON.stringify(newContentData);
            setSessionState(sessionStateKey, pageData);
            setUniqueValue(uniqueValue + 1);
        }
    };

    const handleRemoveBlock = (code: string, blockIndex: number) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (Content) {
            const prevContentData = JSON.parse(Content?.ContentData.S);
            (prevContentData[code] as Array<ContentDataBlock>).splice(blockIndex, 1);
            Content.ContentData.S = JSON.stringify(prevContentData);
            setSessionState(sessionStateKey, pageData);
            setUniqueValue(uniqueValue + 1);
        }
    };

    const handleMoveBlock = (code: string, blockIndex: number) => (newBlockIndex: number) => {
        if (Content) {
            let prevContentData = JSON.parse(Content?.ContentData.S);
            prevContentData[code] = arrayMove(prevContentData[code], blockIndex, newBlockIndex);
            Content.ContentData.S = JSON.stringify(prevContentData);
            setSessionState(sessionStateKey, pageData);
            setUniqueValue(uniqueValue + 1);
        }
    };

    const handleAddNewField = (fieldPath: string, fieldIndex: number) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (Content) {
            const prevContentData = JSON.parse(Content?.ContentData.S);
            const fieldContentData: Array<ContentDataField> = get(prevContentData, fieldPath, []);
            fieldContentData.splice(fieldIndex, 0, {value: ''});
            set(prevContentData, fieldPath, fieldContentData);
            Content.ContentData.S = JSON.stringify(prevContentData);
            setSessionState(sessionStateKey, pageData);
            setUniqueValue(uniqueValue + 1);
        }
    };

    const handleRemoveField = (fieldPath: string, fieldIndex: number) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (Content) {
            const prevContentData = JSON.parse(Content?.ContentData.S);
            const fieldContentData: Array<ContentDataField> = get(prevContentData, fieldPath, []);
            if (fieldContentData.length > 0) {
                fieldContentData.splice(fieldIndex, 1);
                set(prevContentData, fieldPath, fieldContentData);
                Content.ContentData.S = JSON.stringify(prevContentData);
                setSessionState(sessionStateKey, pageData);
                setUniqueValue(uniqueValue + 1);
            }
        }
    };

    const handleMoveField = (fieldPath: string, fieldIndex: number) => (newFieldIndex: number) => {
        if (Content) {
            if (Content) {
                const prevContentData = JSON.parse(Content?.ContentData.S);
                let fieldContentData: Array<ContentDataField> = get(prevContentData, fieldPath, []);
                if (fieldContentData.length > 0) {
                    fieldContentData = arrayMove(fieldContentData, fieldIndex, newFieldIndex);
                    set(prevContentData, fieldPath, fieldContentData);
                    Content.ContentData.S = JSON.stringify(prevContentData);
                    setSessionState(sessionStateKey, pageData);
                    setUniqueValue(uniqueValue + 1);
                }
            }
        }
    };

    const renderField = (
        fieldClass: ContentDataFieldClass,
        fieldPath: string
    ) => {
        const isFieldArray = !!fieldClass.isArray;
        if (isFieldArray) {
            const fieldsContents: Array<ContentDataField> = get(contentData, fieldPath, []) as Array<ContentDataField>;
            if (fieldsContents.length === 0) {
                return (
                    <div key={`firstField_${fieldClass.code}`} className="flex flex-row gap-2 items-center justify-between">
                        <Label className="text-muted-foreground">
                            {fieldClass.label}
                        </Label>
                        <div>
                            <ButtonAction
                                Icon={LucidePlus}
                                size="xxs"
                                variant="outline"
                                onClick={handleAddNewField(fieldPath, 0)}
                            />
                        </div>
                    </div>
                );
            } else {
                return fieldsContents.map((fieldContent, fieldContentIndex) => {
                    return (
                        <div key={`field_${fieldClass.code}_${fieldContentIndex}`} className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <Label
                                    className="flex flex-row gap-2 items-center text-muted-foreground"
                                    htmlFor={`${fieldPath}.${fieldContentIndex}`}
                                >
                                    {fieldClass.label}
                                    <IndexPositionBadge
                                        index={fieldContentIndex}
                                        length={fieldsContents.length}
                                        onSelect={handleMoveField(fieldPath, fieldContentIndex)}
                                        label={fieldClass.label}
                                    />
                                </Label>
                                <div className="flex flex-row gap-2 items-center">
                                    <div>
                                        <ButtonAction
                                            Icon={LucideMinus}
                                            size="xxs"
                                            variant="outline"
                                            onClick={handleRemoveField(fieldPath, fieldContentIndex)}
                                        />
                                    </div>
                                    <div>
                                        <ButtonAction
                                            Icon={LucidePlus}
                                            size="xxs"
                                            variant="outline"
                                            onClick={handleAddNewField(fieldPath, fieldContentIndex + 1)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col gap-2">
                                {fieldClass.type === 'text' && (
                                    <ControlText
                                        key={`${fieldPath}.${fieldContentIndex}`}
                                        controlKey={uniqueValue}
                                        contentData={contentData}
                                        fieldPath={`${fieldPath}.${fieldContentIndex}`}
                                        disabled={isInAction}
                                        onChange={handleContentDataChange}
                                    />
                                )}
                                {fieldClass.type === 'image' && (
                                    <ControlImage
                                        key={`${fieldPath}.${fieldContentIndex}`}
                                        controlKey={uniqueValue}
                                        fieldPath={`${fieldPath}.${fieldContentIndex}`}
                                        contentData={contentData}
                                        disabled={isInAction}
                                        onChange={handleContentDataChange}
                                    />
                                )}
                                {fieldClass.type === 'rich_text' && (
                                    <ControlTipTap
                                        key={`${fieldPath}.${fieldContentIndex}`}
                                        controlKey={uniqueValue}
                                        fieldPath={`${fieldPath}.${fieldContentIndex}`}
                                        contentData={contentData}
                                        disabled={isInAction}
                                        onChange={handleContentDataChange}
                                    />
                                )}
                                <ActionDataFieldError
                                    actionData={actionData}
                                    fieldName={fieldPath}
                                />
                            </div>
                        </div>
                    );
                });
            }
        } else {
            return (
                <div key={`field_${fieldClass.code}`}
                     className="flex flex-col gap-2">
                    <Label className="text-muted-foreground" htmlFor={fieldPath}>
                        {fieldClass.label}
                    </Label>
                    <div className="ml-3 flex flex-col gap-2">
                        {fieldClass.type === 'text' && (
                            <ControlText
                                key={fieldPath}
                                controlKey={uniqueValue}
                                contentData={contentData}
                                fieldPath={fieldPath}
                                disabled={isInAction}
                                onChange={handleContentDataChange}
                            />
                        )}
                        {fieldClass.type === 'image' && (
                            <ControlImage
                                key={fieldPath}
                                controlKey={uniqueValue}
                                fieldPath={fieldPath}
                                contentData={contentData}
                                disabled={isInAction}
                                onChange={handleContentDataChange}
                            />
                        )}
                        {fieldClass.type === 'rich_text' && (
                            <ControlTipTap
                                key={fieldPath}
                                controlKey={uniqueValue}
                                fieldPath={fieldPath}
                                contentData={contentData}
                                disabled={isInAction}
                                onChange={handleContentDataChange}
                            />
                        )}
                        <ActionDataFieldError
                            actionData={actionData}
                            fieldName={fieldPath}
                        />
                    </div>
                </div>
            );
        }
    };

    return (
        <Card className="relative w-full h-full pt-6">
            <CardContent className="h-full flex flex-col gap-2 relative">
                {isDataConfigMode
                    ? (
                        <CodeEditorJson
                            readOnly={isInAction}
                            code={Content?.ContentDataConfig.S || ''}
                            onSubmit={handleSubmitConfig}
                            onCancel={() => setDataConfigMode(false)}
                        />
                    )
                    : (
                        <>
                            <div className="absolute -top-[23px] right-[2px] z-10">
                                <div>
                                    <ButtonAction
                                        variant="ghost"
                                        className="rounded-full"
                                        size="xs"
                                        Icon={LucideSettings}
                                        onClick={() => setDataConfigMode(true)}
                                    />
                                </div>
                            </div>
                            <ScrollArea className="grow h-full w-full pr-6">
                                <div className="h-full w-full flex flex-col gap-4">
                                    {contentDataError && (
                                        <div>
                                            <p className="text-xs text-red-600">{contentDataError}</p>
                                        </div>
                                    )}
                                    {contentDataConfigClass.map((blockClass: ContentDataBlockClass, idx: number) => {
                                        const isBlockArray = blockClass.isArray;
                                        const blockContent = get(contentData, `${blockClass.code}`, isBlockArray ? [] : {});
                                        if (isBlockArray) {
                                            if ((blockContent as Array<ContentDataBlock>).length === 0) {
                                                return (
                                                    <div
                                                        key={`firstBlock_${blockClass.code}`}
                                                        className="flex flex-row gap-2 items-center justify-between"
                                                    >
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">{blockClass.label}</p>
                                                        </div>
                                                        <div>
                                                            <ButtonAction
                                                                Icon={LucidePlus}
                                                                size="xxs"
                                                                variant="outline"
                                                                onClick={handleAddNewBlock(blockClass.code, 0)}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div key={`block_${idx}_${blockClass.code}`} className="flex flex-col gap-4">
                                                        {(blockContent as Array<ContentDataBlock>).map((blockItem, blockItemIndex) => {
                                                            return (
                                                                <React.Fragment
                                                                    key={`block_${idx}_${blockClass.code}_${blockItemIndex}`}>
                                                                    <div
                                                                        className="flex flex-row gap-2 items-center justify-between">
                                                                        <div className="flex flex-row gap-2 items-center">
                                                                            <p className="text-sm text-muted-foreground">{blockClass.label}</p>
                                                                            <IndexPositionBadge
                                                                                index={blockItemIndex}
                                                                                length={(blockContent as Array<ContentDataBlock>).length}
                                                                                onSelect={handleMoveBlock(blockClass.code, blockItemIndex)}
                                                                                label={blockClass.label}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className="flex flex-row gap-2 items-center">
                                                                            <div>
                                                                                <ButtonAction
                                                                                    Icon={LucideMinus}
                                                                                    size="xxs"
                                                                                    variant="outline"
                                                                                    onClick={handleRemoveBlock(blockClass.code, blockItemIndex)}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <ButtonAction
                                                                                    Icon={LucidePlus}
                                                                                    size="xxs"
                                                                                    variant="outline"
                                                                                    onClick={handleAddNewBlock(blockClass.code, blockItemIndex + 1)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="pl-3 flex flex-col gap-4 border-l-[1px] border-gray-200">
                                                                        {blockClass.fields.map((fieldClass: ContentDataFieldClass, fieldIndex: number) => {
                                                                            const fieldPath = `${blockClass.code}.${blockItemIndex}.${fieldClass.code}`;
                                                                            return renderField(fieldClass, fieldPath);
                                                                        })}
                                                                    </div>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }
                                        }
                                        return (
                                            <React.Fragment key={`block_${idx}`}>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{blockClass.label}</p>
                                                </div>
                                                <div
                                                    className="pl-3 flex flex-col gap-4 border-l-[1px] border-gray-200">
                                                    {blockClass.fields.map((fieldClass: ContentDataFieldClass, fieldIndex: number) => {
                                                        const fieldPath = `${blockClass.code}.${fieldClass.code}`
                                                        return renderField(fieldClass, fieldPath);
                                                    })}
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </>
                    )
                }
            </CardContent>
        </Card>
    );
}
