import React, {useState, useEffect} from 'react';
import {useFetcher} from "react-router-dom";
import {Card, CardContent} from '@/components/ui/card';
import {LucidePencil, LucideExternalLink, LucideX, LucideSave} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {MainPageData} from '@/data/MainPageData';
import {Textarea} from '@/components/ui/textarea';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';
import {openPreview} from '@/utils/PreviewUtils';
import {ButtonAction} from '@/components/utils/ButtonAction';
import IFrameExtended from '@/components/utils/IFrameExtended';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {getHTML} from '@/subfeatures/mainPage/templateProcessor';

interface MainPageFormProps {
    mainPageData?: MainPageData;
    isLoadingData?: boolean;
}

export function MainPageForm(props: MainPageFormProps) {
    const {mainPageData, isLoadingData = false} = props;
    const fetcher = useFetcher();
    const [isEditing, setEditing] = useState<boolean>(false);
    const [html, setHtml] = useState<string>();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.ok) {
            setEditing(false);
        }
    }, [fetcher.state, fetcher.data]);

    useEffect(() => {
        if (fetcher.state === 'idle') {
            setHtml(getHTML({
                styles: '',
                script: mainPageData?.PageBody?.S || '',
                data: {}
            }));
        }
    }, [fetcher.state]);

    const handleReset = () => {
        fetcher.submit({action: FORM_ACTION_RESET}, {method: 'post'});
    };

    const handleStartEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setEditing(true);
    };

    const handlePreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        openPreview().catch((e: any) => {
            console.error(e);
        });
    };

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newHtml = getHTML({
            styles: '',
            script: e.currentTarget.value,
            data: {}
        });
        setHtml(newHtml);
    };

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;
    return (
        <fetcher.Form method="post" onReset={handleReset} className="w-full h-full p-4">
            <Tabs defaultValue="content" className="flex flex-col gap-2 w-full h-full">
                <input name="action" type="hidden" defaultValue={FORM_ACTION_SUBMIT}/>
                <input name="pk" type="hidden" defaultValue={mainPageData?.PK?.S || ''}/>
                <input name="sk" type="hidden" defaultValue={mainPageData?.SK?.S || ''}/>
                <div className="flex flex-col gap-2 mb-4">
                    <p className="text-xl">Home Page Content</p>
                    {/*<p className="text-sm text-muted-foreground">Set the home page content here</p>*/}
                </div>
                {!isEditing
                    ? (
                        <>
                            <div className="flex flex-row gap-2 w-full">
                                <ButtonAction
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    isLoading={isLoadingData}
                                    Icon={LucidePencil}
                                    label="Edit"
                                    onClick={handleStartEditing}
                                />
                                <ButtonAction
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    isLoading={isLoadingData}
                                    Icon={LucideExternalLink}
                                    label="Preview Page"
                                    onClick={handlePreview}
                                />
                            </div>
                            <div className="relative w-full h-[500px]">
                                <IFrameExtended zoomOut={false} srcdoc={html || ''}/>
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="flex flex-row justify-between w-full">
                                <div className="flex flex-row gap-2">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="content">Content</TabsTrigger>
                                        <TabsTrigger value="meta">SEO</TabsTrigger>
                                        <TabsTrigger value="script">Script</TabsTrigger>
                                        <TabsTrigger value="styles">Styles</TabsTrigger>
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
                                        type="submit"
                                        variant="default"
                                        size="sm"
                                        isLoading={isInAction}
                                        Icon={LucideSave}
                                        label="Save Changes"
                                    />
                                </div>
                            </div>
                            <ActionDataRequestError actionData={fetcher.data}/>
                            <div className="w-full h-full flex-grow flex flex-row gap-4">
                                <div className="h-full w-1/2 relative">
                                    <TabsContent value="content" className="absolute top-0 left-0 right-0 bottom-0">
                                        <ScrollArea className="h-full w-full pr-2">
                                            <Card className="w-full h-full pt-6">
                                                <CardContent className="flex flex-col gap-4">
                                                    <p>None</p>
                                                </CardContent>
                                            </Card>
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="meta" className="absolute top-0 left-0 right-0 bottom-0">
                                        <ScrollArea className="h-full w-full pr-2">
                                            <Card className="w-full h-full pt-6">
                                                <CardContent className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="pageTitle">Page Title</Label>
                                                        <Input
                                                            name="pageTitle"
                                                            type="text"
                                                            autoFocus={true}
                                                            disabled={!isEditing || isInAction}
                                                            defaultValue={mainPageData?.PageTitle?.S || ''}
                                                        />
                                                        <ActionDataFieldError actionData={fetcher.data}
                                                                              fieldName="pageTitle"/>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label htmlFor="pageDescription">Page Description</Label>
                                                        <Input
                                                            name="pageDescription"
                                                            type="text"
                                                            disabled={!isEditing || isInAction}
                                                            defaultValue={mainPageData?.PageDescription?.S || ''}
                                                        />
                                                        <ActionDataFieldError actionData={fetcher.data}
                                                                              fieldName="pageDescription"/>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="script" className="absolute top-0 left-0 right-0 bottom-0">
                                        <ScrollArea className="h-full w-full pr-2">
                                            <div className="flex flex-col gap-2">
                                                <Textarea
                                                    name="pageBody"
                                                    disabled={!isEditing || isInAction}
                                                    defaultValue={mainPageData?.PageBody?.S || ''}
                                                    onChange={handleScriptChange}
                                                    rows={8}
                                                />
                                                <ActionDataFieldError actionData={fetcher.data}
                                                                      fieldName="pageBody"/>
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="styles" className="absolute top-0 left-0 right-0 bottom-0">
                                        <ScrollArea className="h-full w-full pr-2">
                                            <div className="flex flex-col gap-2">
                                                <Textarea
                                                    name="pageBody"
                                                    disabled={!isEditing || isInAction}
                                                    defaultValue={mainPageData?.PageStyles?.S || ''}
                                                    rows={8}
                                                />
                                                <ActionDataFieldError actionData={fetcher.data}
                                                                      fieldName="pageBody"/>
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>
                                </div>
                                <div className="relative w-1/2 h-full">
                                    <IFrameExtended zoomOut={true} srcdoc={html || ''}/>
                                </div>
                            </div>
                        </>
                    )
                }
            </Tabs>
        </fetcher.Form>
    );
}