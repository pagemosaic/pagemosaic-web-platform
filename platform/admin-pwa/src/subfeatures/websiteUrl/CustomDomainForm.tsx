import React from 'react';
import {useFetcher, Link} from "react-router-dom";
import {Card, CardHeader, CardDescription, CardContent} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {DelayedLoading} from '@/components/utils/DelayedLoading';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils'
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {Separator} from '@/components/ui/separator';

interface CustomDomainFormProps {
    websiteUrlData?: WebsiteUrlData;
    isLoadingData?: boolean;
}

export function CustomDomainForm(props: CustomDomainFormProps) {
    const {websiteUrlData, isLoadingData = false} = props;
    const fetcher = useFetcher();

    const handleReset = () => {
        fetcher.submit({action: FORM_ACTION_RESET}, {method: 'post'});
    };

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;
    return (
        <fetcher.Form method="post" onReset={handleReset} className="flex flex-col gap-2 w-full h-full p-4">
            <div className="mb-4">
                <p className="text-xl">Website Custom Domain</p>
                {/*<Separator className="mb-4" />*/}
            </div>
            <input name="action" type="hidden" defaultValue={FORM_ACTION_SUBMIT}/>
            <div className="flex flex-row gap-2">
                {isLoadingData
                    ? (
                        <Button
                            type="reset"
                            size="sm"
                            variant="ghost"
                            disabled={true}
                        >
                            Loading...
                        </Button>
                    )
                    : (
                        <>
                            <Button size="sm" variant="ghost" disabled={isInAction} asChild={true}>
                                <Link to="/settings/website-url">Cancel</Link>
                            </Button>
                            <Button
                                type="submit"
                                variant="outline"
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
                }
            </div>
            <div className="grow overflow-hidden">
                <input name="prevCustomDomainName" type="hidden"
                       defaultValue={websiteUrlData?.customDomainName || ''}/>
                <ScrollArea className="w-full h-full">
                    <Card className="w-[500px] pt-6">
                        <ActionDataRequestError actionData={fetcher.data} className="p-6 pt-0"/>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="customDomainName">Custom Domain Name</Label>
                                    <Input
                                        name="customDomainName"
                                        type="text"
                                        disabled={isInAction}
                                        defaultValue={websiteUrlData?.customDomainName || ''}
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="customDomainName"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </fetcher.Form>
    );
}