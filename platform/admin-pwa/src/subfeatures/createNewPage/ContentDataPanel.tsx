import React from 'react';
import {debounce, get, set} from 'lodash-es';
import {DI_ContentSlice} from 'infra-common/data/DocumentItem';
import {Card, CardContent} from '@/components/ui/card';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {setSessionState, useSessionState} from '@/utils/localStorage';
import {NewPageData} from '@/data/NewPageData';
import {
    ContentDataConfigClass,
    ContentDataBlockClass,
    ContentDataFieldClass
} from 'infra-common/data/ContentDataConfig';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ContentData} from 'infra-common/data/ContentData';

interface ContentDataPanelProps {
    sessionStateKey: string;
    isInAction?: boolean;
    actionData: any;
}

export function ContentDataPanel(props: ContentDataPanelProps) {
    const {sessionStateKey, isInAction, actionData} = props;

    const {value: newPageData} = useSessionState<NewPageData>(sessionStateKey);

    if (!newPageData?.pagesEntry.Content) {
        return (
            <div>
                <p>Missing Initial Data For Content Data</p>
            </div>
        );
    }

    const {Content} = newPageData.pagesEntry;

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

    const debouncedOnChange = debounce((field: keyof DI_ContentSlice, newValue: string) => {
        if (Content) {
            Content[field] = {S: newValue};
            setSessionState(sessionStateKey, newPageData);
        }
    }, 800);

    const debouncedOnContentDataTextChange = debounce((path: string, value: string) => {
        if (Content) {
            const newContentData = set(contentData, path, value);
            Content.ContentData.S = JSON.stringify(newContentData);
            setSessionState(sessionStateKey, newPageData);
        }

    }, 800);

    const handleChange = (field: keyof DI_ContentSlice) => (code: string) => {
        debouncedOnChange(field, code);
    };

    const handleContentDataTextChange = (path: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedOnContentDataTextChange(path, e.currentTarget.value);
    };

    console.log('Render Content Data Panel');

    return (
        <Card className="w-full h-full pt-6">
            <CardContent className="h-full">
                <div className="h-full w-full flex flex-col gap-2">
                    <ActionDataFieldError actionData={actionData}
                                          fieldName="ContentStyles"/>
                    {contentDataError && (
                        <div>
                            <p className="text-xs text-red-600">{contentDataError}</p>
                        </div>
                    )}
                    {contentDataConfigClass.map((blockClass: ContentDataBlockClass, idx: number) => {
                        return (
                            <React.Fragment key={`block_${idx}`}>
                                <div>
                                    <p className="text-xs text-muted-foreground">{blockClass.label}</p>
                                </div>
                                <div className="ml-3 flex flex-col gap-2">
                                    {blockClass.fields.map((fieldClass: ContentDataFieldClass, fieldIndex: number) => {
                                        if (fieldClass.type === 'text') {
                                            const fieldPath = `${blockClass.code}.${fieldClass.code}`;
                                            let defaultTextValue = get(
                                                contentData,
                                                `${fieldPath}.value`,
                                                undefined
                                            ) as string | undefined;
                                            return (
                                                <div key={`field_${fieldIndex}`} className="flex flex-col gap-2">
                                                    <Label htmlFor={fieldPath}>
                                                        {fieldClass.label}
                                                    </Label>
                                                    <Input
                                                        name={fieldPath}
                                                        type="text"
                                                        disabled={isInAction}
                                                        defaultValue={defaultTextValue}
                                                        onChange={handleContentDataTextChange(`${fieldPath}.value`)}
                                                    />
                                                    <ActionDataFieldError
                                                        actionData={actionData}
                                                        fieldName={fieldPath}
                                                    />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
