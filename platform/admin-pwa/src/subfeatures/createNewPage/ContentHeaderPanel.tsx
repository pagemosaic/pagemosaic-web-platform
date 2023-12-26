import React from 'react';
import {debounce} from 'lodash-es';
import {DI_ContentSlice} from 'infra-common/data/DocumentItem';
import {Card, CardContent} from '@/components/ui/card';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {getSessionState, setSessionState} from '@/utils/localStorage';
import {NewPageData} from '@/data/NewPageData';
import {CodeEditor} from '@/components/utils/CodeEditor';

interface ContentHeaderPanelProps {
    sessionStateKey: string;
    isInAction?: boolean;
    actionData: any;
}

export function ContentHeaderPanel(props: ContentHeaderPanelProps) {
    const {sessionStateKey, isInAction, actionData} = props;

    const newPageData: NewPageData | undefined = getSessionState<NewPageData>(sessionStateKey);

    if (!newPageData?.pagesEntry.Content) {
        return (
            <div>
                <p>Missing Initial Data For Content Script</p>
            </div>
        );
    }

    const {Content} = newPageData.pagesEntry;

    const debouncedOnChange = debounce((field: keyof DI_ContentSlice, newValue: string) => {
        if (Content) {
            Content[field] = {S: newValue};
            setSessionState(sessionStateKey, newPageData);
        }
    }, 800);

    const handleChange = (field: keyof DI_ContentSlice) => (code: string) => {
        debouncedOnChange(field, code);
    };

    return (
        <Card className="w-full h-full pt-6">
            <CardContent className="h-full">
                <div className="h-full w-full flex flex-col gap-2">
                    <ActionDataFieldError actionData={actionData}
                                          fieldName="ContentScript"/>
                    <CodeEditor
                        language="html"
                        code={Content?.ContentHeader.S || ''}
                        readOnly={isInAction}
                        onChange={handleChange('ContentHeader')}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
