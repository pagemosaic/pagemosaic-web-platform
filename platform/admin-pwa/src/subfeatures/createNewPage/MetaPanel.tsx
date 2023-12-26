import {DI_MetaSlice} from 'infra-common/data/DocumentItem';
import {Card, CardContent} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {ScrollArea} from '@/components/ui/scroll-area';
import React from 'react';
import {getSessionState, setSessionState} from '@/utils/localStorage';
import {NewPageData} from '@/data/NewPageData';
import {debounce} from 'lodash-es';

interface MetaPanelProps {
    sessionStateKey: string;
    isInAction?: boolean;
    actionData: any;
}

export function MetaPanel(props: MetaPanelProps) {
    const {sessionStateKey, isInAction, actionData} = props;

    const newPageData: NewPageData | undefined = getSessionState<NewPageData>(sessionStateKey);

    if (!newPageData?.pagesEntry.Meta) {
        return (
            <div>
                <p>Missing Initial Data</p>
            </div>
        );
    }

    const {Meta} = newPageData.pagesEntry;

    const debouncedOnChange = debounce((field: keyof DI_MetaSlice, newValue: string) => {
        if (Meta) {
            Meta[field] = {S: newValue};
            setSessionState(sessionStateKey, newPageData);
        }
    }, 800);

    const handleChange = (field: keyof DI_MetaSlice) => (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedOnChange(field, e.currentTarget.value);
    };

    return (
        <Card className="w-full h-full pt-6">
            <CardContent className="h-full">
                <ScrollArea className="h-full w-full pr-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="MetaTitle">Page Title</Label>
                            <Input
                                name="MetaTitle"
                                type="text"
                                autoFocus={true}
                                disabled={isInAction}
                                defaultValue={Meta?.MetaTitle.S || ''}
                                onChange={handleChange('MetaTitle')}
                            />
                            <ActionDataFieldError actionData={actionData}
                                                  fieldName="MetaTitle"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="MetaSlug">Slug</Label>
                            <Input
                                name="MetaSlug"
                                type="text"
                                disabled={isInAction}
                                defaultValue={Meta?.MetaSlug.S || ''}
                                onChange={handleChange('MetaSlug')}
                            />
                            <ActionDataFieldError actionData={actionData}
                                                  fieldName="MetaTitle"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="MetaDescription">Page Description</Label>
                            <Input
                                name="MetaDescription"
                                type="text"
                                disabled={isInAction}
                                defaultValue={Meta?.MetaDescription.S || ''}
                                onChange={handleChange('MetaDescription')}
                            />
                            <ActionDataFieldError actionData={actionData}
                                                  fieldName="MetaDescription"/>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
