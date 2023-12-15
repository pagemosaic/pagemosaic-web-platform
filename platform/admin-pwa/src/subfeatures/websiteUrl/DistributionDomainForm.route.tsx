import React from 'react';
import {Await, useRouteLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import {WebsiteUrlDataLoaderResponse} from './websiteUrl.loader';
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {DistributionDomainForm} from './DistributionDomainForm';

export function DistributionDomainFormRoute() {
    const {websiteUrlDataRequest} = useRouteLoaderData('website-url') as WebsiteUrlDataLoaderResponse;
    return (
        <React.Suspense fallback={<DistributionDomainForm isLoadingData={true}/>}>
            <Await
                resolve={websiteUrlDataRequest}
                errorElement={<AwaitError/>}
            >
                {(websiteUrlData: WebsiteUrlData) => {
                    return (
                        <DistributionDomainForm
                            websiteUrlData={websiteUrlData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
