import React, {useState, useEffect} from 'react';
import {useFetcher} from "react-router-dom";
import {Card, CardHeader, CardDescription, CardContent} from '@/components/ui/card';
import {LucidePencil, LucideRotateCw, LucideExternalLink} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {MainPageData} from '@/data/MainPageData';
import {Textarea} from '@/components/ui/textarea';
import {DelayedLoading} from '@/components/utils/DelayedLoading';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils';
import {openPreview} from '@/utils/PreviewUtils';

interface MainPageFormProps {
    mainPageData?: MainPageData;
    isLoadingData?: boolean;
}

export function MainPageForm(props: MainPageFormProps) {
    const {mainPageData, isLoadingData = false} = props;
    const fetcher = useFetcher();
    const [isEditing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.ok) {
            setEditing(false);
        }
    }, [fetcher.state, fetcher.data]);

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

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;
    return (
        <fetcher.Form method="post" onReset={handleReset} className="flex flex-col gap-2 w-full h-full p-4">
            <input name="action" type="hidden" defaultValue={FORM_ACTION_SUBMIT}/>
            <input name="pk" type="hidden" defaultValue={mainPageData?.PK?.S || ''}/>
            <input name="sk" type="hidden" defaultValue={mainPageData?.SK?.S || ''}/>
            <div className="flex flex-row gap-2">
                {isEditing
                    ? (
                        <>
                            <Button
                                type="reset"
                                size="sm"
                                variant="ghost"
                                disabled={isInAction}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isInAction}
                            >
                                <DelayedLoading
                                    isLoading={isInAction}
                                    loadingElement={<span>Saving...</span>}
                                    element={<span>Save Changes</span>}
                                />
                            </Button>
                        </>
                    )
                    : (
                        <>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isLoadingData}
                                onClick={handleStartEditing}
                            >
                                <DelayedLoading
                                    isLoading={isLoadingData}
                                    loadingElement={(
                                        <>
                                            <LucideRotateCw className="mr-2 h-3 w-3 animate-spin"/>
                                            Loading...
                                        </>
                                    )}
                                    element={(
                                        <>
                                            <LucidePencil className="mr-2 h-3 w-3"/>
                                            Edit
                                        </>
                                    )}
                                />
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isLoadingData}
                                onClick={handlePreview}
                            >
                                <LucideExternalLink className="mr-2 h-3 w-3" />
                                Preview Page
                            </Button>
                        </>
                    )
                }
            </div>
            <div className="grow overflow-hidden">
                <ScrollArea className="w-full h-full">
                    <Card className="w-[500px]">
                        <CardHeader>
                            <CardDescription>Set the Home page content here</CardDescription>
                            <ActionDataRequestError actionData={fetcher.data}/>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Title</Label>
                                    <Input
                                        name="title"
                                        type="text"
                                        autoFocus={true}
                                        disabled={!isEditing || isInAction}
                                        defaultValue={mainPageData?.Title?.S || ''}
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="title"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="heroTitle">Hero Title</Label>
                                    <Input
                                        name="heroTitle"
                                        type="text"
                                        disabled={!isEditing || isInAction}
                                        defaultValue={mainPageData?.HeroTitle?.S || ''}
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="heroTitle"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="body">Body</Label>
                                    <Textarea
                                        name="body"
                                        disabled={!isEditing || isInAction}
                                        defaultValue={mainPageData?.Body?.S || ''}
                                        rows={6}
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="body"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </fetcher.Form>
    );
}