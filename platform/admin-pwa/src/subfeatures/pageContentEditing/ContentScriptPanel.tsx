import React from 'react';
import {debounce} from 'lodash-es';
import {DI_ContentSlice} from 'infra-common/data/DocumentItem';
import {Card, CardContent} from '@/components/ui/card';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {getSessionState, setSessionState} from '@/utils/localStorage';
import {CodeEditorHtml} from '@/components/utils/CodeEditorHtml';
import {PageData} from '@/data/PageData';

interface ContentScriptPanelProps {
    sessionStateKey: string;
    isInAction?: boolean;
    actionData: any;
}

export function ContentScriptPanel(props: ContentScriptPanelProps) {
    const {sessionStateKey, isInAction, actionData} = props;

    const pageData: PageData | undefined = getSessionState<PageData>(sessionStateKey);

    if (!pageData?.pageEntry.Content) {
        return (
            <div>
                <p>Missing Initial Data For Content Script</p>
            </div>
        );
    }

    const {Content} = pageData.pageEntry;

    const debouncedOnChange = debounce((field: keyof DI_ContentSlice, newValue: string) => {
        if (Content) {
            Content[field] = {S: newValue};
            setSessionState(sessionStateKey, pageData);
        }
    }, 800);

    const handleChange = (field: keyof DI_ContentSlice) => (code: string) => {
        debouncedOnChange(field, code);
    };

    return (
        <Card className="w-full h-full pt-6">
            <CardContent className="h-full">
                <div className="h-full w-full flex flex-col gap-2">
                    <ActionDataFieldError
                        actionData={actionData}
                        fieldName="ContentScript"
                    />
                    <CodeEditorHtml
                        readOnly={isInAction}
                        code={Content?.ContentScript.S || ''}
                        onChange={handleChange('ContentScript')}
                        object={JSON.parse(Content?.ContentData.S)}
                        styles={Content?.ContentStyles.S || ''}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
