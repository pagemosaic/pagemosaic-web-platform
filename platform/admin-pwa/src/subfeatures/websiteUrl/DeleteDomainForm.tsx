import React from 'react';
import {useFetcher} from "react-router-dom";
import {Card, CardContent} from '@/components/ui/card';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils'
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {ButtonLink} from '@/components/utils/ButtonLink';
import {LucideX, LucideTrash2} from 'lucide-react';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';

interface DeleteDomainFormProps {
    websiteUrlData?: WebsiteUrlData;
    isLoadingData?: boolean;
}

export function DeleteDomainForm(props: DeleteDomainFormProps) {
    const {websiteUrlData, isLoadingData = false} = props;
    const fetcher = useFetcher();

    const handleReset = () => {
        fetcher.submit({action: FORM_ACTION_RESET}, {method: 'post'});
    };

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;
    return (
        <fetcher.Form method="post" onReset={handleReset} className="flex flex-col gap-2 w-full h-full p-4">
            <div className="mb-4">
                <p className="text-xl">Delete Website Custom Domain</p>
                {/*<Separator className="mb-4" />*/}
            </div>
            <input name="action" type="hidden" defaultValue={FORM_ACTION_SUBMIT}/>
            <div className="flex flex-row gap-2">
                <>
                    <ButtonLink
                        size="sm"
                        variant="ghost"
                        isLoading={isInAction}
                        to="/settings/website-url"
                        Icon={LucideX}
                        label="Cancel"
                    />
                    <ButtonAction
                        type="submit"
                        variant="outline"
                        size="sm"
                        isLoading={isInAction}
                        Icon={LucideTrash2}
                        label="Delete"
                    />
                </>
            </div>
            <div className="grow overflow-hidden">
                <input name="sslCertificateArn"
                       type="hidden"
                       defaultValue={websiteUrlData?.sslCertificateArn || ''}
                />
                <ScrollArea className="w-full h-full">
                    <Card className="w-[500px] pt-6">
                        <ActionDataRequestError actionData={fetcher.data} className="p-6 pt-0"/>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <p className="text-sm font-semibold text-red-600">
                                    Are you sure you want to delete the current domain name?
                                </p>
                                <ActionDataFieldError actionData={fetcher.data} fieldName="sslCertificateArn"/>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </fetcher.Form>
    );
}