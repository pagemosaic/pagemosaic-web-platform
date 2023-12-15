import {Await, useRouteLoaderData, useLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {WebsiteUrlDataLoaderResponse} from './websiteUrl.loader';
import {WebsiteUrlData} from '@/data/WebsiteUrlData';
import {WebsiteUrlView} from './WebsiteUrlView';

export function WebsiteUrlViewRoute() {
    const {websiteUrlDataRequest} = useRouteLoaderData('website-url') as WebsiteUrlDataLoaderResponse;
    return (
        <React.Suspense fallback={<WebsiteUrlView isLoadingData={true}/>}>
            <Await
                resolve={websiteUrlDataRequest}
                errorElement={<AwaitError/>}
            >
                {(websiteUrlData: WebsiteUrlData) => {
                    return (
                        <WebsiteUrlView
                            websiteUrlData={websiteUrlData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
