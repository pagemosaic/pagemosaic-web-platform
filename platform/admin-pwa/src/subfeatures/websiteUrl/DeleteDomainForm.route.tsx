import React from 'react';
import {Await, useRouteLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import {WebsiteUrlDataLoaderResponse} from './websiteUrl.loader';
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {DeleteDomainForm} from './DeleteDomainForm';

export function DeleteDomainFormRoute() {
    const {websiteUrlDataRequest} = useRouteLoaderData('website-url') as WebsiteUrlDataLoaderResponse;
    return (
        <React.Suspense fallback={<DeleteDomainForm isLoadingData={true}/>}>
            <Await
                resolve={websiteUrlDataRequest}
                errorElement={<AwaitError/>}
            >
                {(websiteUrlData: WebsiteUrlData) => {
                    return (
                        <DeleteDomainForm
                            websiteUrlData={websiteUrlData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
