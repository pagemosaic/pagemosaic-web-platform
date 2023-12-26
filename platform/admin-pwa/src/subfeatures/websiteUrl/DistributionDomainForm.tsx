import React from 'react';
import {useFetcher} from "react-router-dom";
import {Card, CardContent} from '@/components/ui/card';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils'
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {ButtonLink} from '@/components/utils/ButtonLink';
import {LucideX, LucideCheck} from 'lucide-react';
import {ButtonAction} from '@/components/utils/ButtonAction';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {CopyToClipboardButton} from '@/components/utils/CopyToClipboardButton';
import {getSubdomainRecordName} from 'infra-common/aws/domain';

interface DistributionDomainFormProps {
    websiteUrlData?: WebsiteUrlData;
    isLoadingData?: boolean;
}


export function DistributionDomainForm(props: DistributionDomainFormProps) {
    const {websiteUrlData, isLoadingData = false} = props;
    const fetcher = useFetcher();

    const handleReset = () => {
        fetcher.submit({action: FORM_ACTION_RESET}, {method: 'post'});
    };

    const isInAction = fetcher.state === 'loading' || fetcher.state === 'submitting' || isLoadingData;
    return (
        <fetcher.Form method="post" onReset={handleReset} className="flex flex-col gap-2 w-full h-full p-4">
            <div className="mb-4">
                <p className="text-xl">Link Custom Domain to Website</p>
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
                        Icon={LucideCheck}
                        label="Link Custom Domain"
                    />
                </>
            </div>
            <div className="grow overflow-hidden">
                <input name="domain"
                       type="hidden"
                       defaultValue={websiteUrlData?.domain || ''}
                />
                <ScrollArea className="w-full h-full pr-4">
                    <Card className="w-full pt-6">
                        <ActionDataRequestError actionData={fetcher.data} className="p-6 pt-0"/>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <ActionDataFieldError actionData={fetcher.data} fieldName="sslCertificateArn"/>
                                <div>
                                    <p className="text-sm">
                                        Ensure to add the following DNS record via your domain name
                                        provider before initiating the domain linking process.
                                    </p>
                                </div>
                                <div>
                                    <table className="w-full border-0 table-fixed">
                                        <thead>
                                        <tr>
                                            <th className="p-2 min-w-[100px] w-[10%]">
                                                <p className="text-sm font-semibold text-muted-foreground">Type</p>
                                            </th>
                                            <th className="p-2 w-[30%]">
                                                <p className="text-sm font-semibold text-muted-foreground">Name</p>
                                            </th>
                                            <th className="p-2">
                                                <p className="text-sm font-semibold text-muted-foreground">Value</p>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td className="px-2 pb-2 pt-6 align-middle">
                                                <div className="rounded-[4px]">
                                                    <p className="text-sm font-normal text-muted-foreground">
                                                        CNAME or ALIAS
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-2 pb-2 pt-6 align-middle relative">
                                                <CopyToClipboardButton
                                                    text={getSubdomainRecordName(websiteUrlData?.domain)}
                                                    size="xs"
                                                    variant="ghost"
                                                    className="absolute top-0 right-2 z-10"
                                                />
                                                <div className="prose">
                                                    <pre className="relative">
                                                        <code>
                                                            {getSubdomainRecordName(websiteUrlData?.domain)}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </td>
                                            <td className="px-2 pb-2 pt-6 align-middle relative">
                                                <CopyToClipboardButton
                                                    variant="ghost"
                                                    text={websiteUrlData?.entryPointDomain || ''}
                                                    size="xs"
                                                    className="absolute top-0 right-2 z-10"
                                                />
                                                <div className="prose w-full overflow-x-auto">
                                                    <pre className="pr-8">
                                                        <code>
                                                            {websiteUrlData?.entryPointDomain}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </fetcher.Form>
    );
}
