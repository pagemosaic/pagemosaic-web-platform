import React from 'react';
import {useFetcher} from "react-router-dom";
import {Card, CardContent} from '@/components/ui/card';
import {LucideX, LucideSave} from 'lucide-react';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {NewPageData} from '@/data/NewPageData';
import {MetaPanel} from '@/subfeatures/createNewPage/MetaPanel';
import {getSessionState} from '@/utils/localStorage';
import {ContentScriptPanel} from '@/subfeatures/createNewPage/ContentScriptPanel';
import {ContentStylesPanel} from '@/subfeatures/createNewPage/ContentStylesPanel';
import {PreviewPanel} from '@/subfeatures/createNewPage/PreviewPanel';
import {ContentDataConfigPanel} from '@/subfeatures/createNewPage/ContentDataConfigPanel';
import {ContentHeaderPanel} from '@/subfeatures/createNewPage/ContentHeaderPanel';
import {ContentDataPanel} from '@/subfeatures/createNewPage/ContentDataPanel';

interface NewPageFormProps {
    sessionStateKey?: string;
    isLoadingData?: boolean;
}

export function NewPageForm(props: NewPageFormProps) {
    const {sessionStateKey, isLoadingData = false} = props;
    const fetcher = useFetcher();

    if (isLoadingData) {
        return (
            <p>Loading...</p>
        );
    }

    if (!sessionStateKey) {
        return (
            <p>Missing initial data</p>
        );
    }

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;

    const handleReset = () => {
        fetcher.submit({action: FORM_ACTION_RESET}, {method: 'post'});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let newPageData: NewPageData | undefined = undefined;
        if (sessionStateKey) {
            newPageData = getSessionState<NewPageData>(sessionStateKey);
        }
        if (newPageData) {
            const formData = new FormData();
            formData.set('MetaTitle', newPageData.pagesEntry.Meta?.MetaTitle.S || '');
            formData.set('ContentScript', newPageData.pagesEntry.Content?.ContentScript.S || '');
            formData.set('action', FORM_ACTION_SUBMIT);
            fetcher.submit(formData, { method: "post" });
        } else {
            console.log('Missing newPageData');
        }
    };

    return (
        <fetcher.Form method="post" onSubmit={(e) => e.preventDefault()} onReset={handleReset} className="w-full h-full p-4">
            <Tabs defaultValue="content" className="flex flex-col gap-2 w-full h-full">
                <div className="flex flex-col gap-2 mb-4">
                    <p className="text-xl">Create New Page</p>
                    {/*<p className="text-sm text-muted-foreground">Set the home page content here</p>*/}
                </div>
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row gap-2">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="meta">SEO</TabsTrigger>
                            <TabsTrigger value="config">Config</TabsTrigger>
                            <TabsTrigger value="script">Body</TabsTrigger>
                            <TabsTrigger value="styles">Styles</TabsTrigger>
                            <TabsTrigger value="header">Head</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex flex-row gap-2">
                        <ButtonAction
                            type="reset"
                            variant="ghost"
                            size="sm"
                            isLoading={isInAction}
                            Icon={LucideX}
                            label="Cancel"
                        />
                        <ButtonAction
                            variant="default"
                            size="sm"
                            isLoading={isInAction}
                            Icon={LucideSave}
                            label="Save Changes"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
                <ActionDataRequestError actionData={fetcher.data}/>
                <div className="w-full h-full flex-grow flex flex-row gap-4">
                    <div className="h-full w-1/2 relative">
                        <TabsContent value="content" className="absolute top-0 left-0 right-0 bottom-0">
                            <ContentDataPanel
                                sessionStateKey={sessionStateKey}
                                actionData={fetcher.data}
                            />
                        </TabsContent>
                        <TabsContent value="meta" className="absolute top-0 left-0 right-0 bottom-0">
                            <MetaPanel
                                sessionStateKey={sessionStateKey}
                                actionData={fetcher.data}
                            />
                        </TabsContent>
                        <TabsContent value="config" className="absolute top-0 left-0 right-0 bottom-0">
                            <ContentDataConfigPanel
                                sessionStateKey={sessionStateKey}
                                actionData={fetcher.data}
                            />
                        </TabsContent>
                        <TabsContent value="script" className="absolute top-0 left-0 right-0 bottom-0">
                            <ContentScriptPanel
                                sessionStateKey={sessionStateKey}
                                actionData={fetcher.data}
                            />
                        </TabsContent>
                        <TabsContent value="styles" className="absolute top-0 left-0 right-0 bottom-0">
                            <ContentStylesPanel
                                sessionStateKey={sessionStateKey}
                                actionData={fetcher.data}
                            />
                        </TabsContent>
                        <TabsContent value="header" className="absolute top-0 left-0 right-0 bottom-0">
                            <ContentHeaderPanel
                                sessionStateKey={sessionStateKey}
                                actionData={fetcher.data}
                            />
                        </TabsContent>
                    </div>
                    <div className="relative w-1/2 h-full">
                        <PreviewPanel sessionStateKey={sessionStateKey} />
                    </div>
                </div>
            </Tabs>
        </fetcher.Form>
    );
}
