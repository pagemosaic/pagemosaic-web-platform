import React from 'react';
import {Await, useLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import {PageTemplatesData} from '@/data/PageTemplatesData';
import {AllPageTemplatesDataLoaderResponse} from './newPageTemplates.loader';
import {AllPageTemplatesView} from './AllPageTemplatesView';

export function NewPageTemplatesRoute() {
    const {pageTemplatesDataRequest} = useLoaderData() as AllPageTemplatesDataLoaderResponse;
    return (
        <React.Suspense fallback={<AllPageTemplatesView isLoadingData={true}/>}>
            <Await
                resolve={pageTemplatesDataRequest}
                errorElement={<AwaitError/>}
            >
                {(allPageTemplatesData: PageTemplatesData) => {
                    return (
                        <AllPageTemplatesView
                            pageTemplatesData={allPageTemplatesData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
