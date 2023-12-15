import React from 'react';
import {useFetcher, Link} from "react-router-dom";
import {Card, CardContent} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ActionDataRequestError} from '@/components/utils/ActionDataRequestError';
import {ScrollArea} from '@/components/ui/scroll-area';
import {FORM_ACTION_SUBMIT, FORM_ACTION_RESET} from '@/utils/FormUtils'
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {ActionDataFieldError} from '@/components/utils/ActionDataFieldError';
import {ButtonLink} from '@/components/utils/ButtonLink';
import {LucideX, LucideSave} from 'lucide-react';
import {ButtonAction} from '@/components/utils/ButtonAction';

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
                <p className="text-xl">Set Website Custom Domain</p>
                <p className="text-sm text-muted-foreground max-w-[70ch]">
                    Remember to purchase a domain name from a domain service provider.
                    Also, ensure you have access to the DNS record management panel.
                </p>
                {/*<Separator className="mb-4" />*/}
            </div>
            <input name="action" type="hidden" defaultValue={FORM_ACTION_SUBMIT}/>
            <div className="flex flex-row gap-2">
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
                    Icon={LucideSave}
                    label="Save Custom Domain"
                />
            </div>
            <div className="grow overflow-hidden">
                <ScrollArea className="w-full h-full">
                    <Card className="w-[500px] pt-6">
                        <ActionDataRequestError actionData={fetcher.data} className="p-6 pt-0"/>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="customDomainName">Domain Name</Label>
                                    <Input
                                        name="customDomainName"
                                        type="text"
                                        disabled={isInAction}
                                        defaultValue=""
                                    />
                                    <ActionDataFieldError actionData={fetcher.data} fieldName="customDomainName"/>
                                    <p className="text-sm text-muted-foreground max-w-[70ch]">
                                        You can specify only second-level or third-level domain names.
                                        For example, use <code>promo.domain.com</code> or <code>domain.com</code>.
                                    </p>
                                    <p className="text-sm text-muted-foreground max-w-[70ch]">
                                        Additionally, you can specify a wildcard domain name, allowing you to use subdomains for your website's pages.
                                        For instance, use <code>*.domain.com</code>.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
        </fetcher.Form>
    );
}