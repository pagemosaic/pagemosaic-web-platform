import {Await, useRouteLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {WebsiteUrlDataLoaderResponse} from './websiteUrl.loader';
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {CustomDomainForm} from './CustomDomainForm';

export function CustomDomainFormRoute() {
    const {websiteUrlDataRequest} = useRouteLoaderData('website-url') as WebsiteUrlDataLoaderResponse;
    return (
        <React.Suspense fallback={<CustomDomainForm isLoadingData={true}/>}>
            <Await
                resolve={websiteUrlDataRequest}
                errorElement={<AwaitError/>}
            >
                {(websiteUrlData: WebsiteUrlData) => {
                    return (
                        <CustomDomainForm
                            websiteUrlData={websiteUrlData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
