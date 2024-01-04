import {Await, useLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {PagesData} from '@/data/PagesData';
import {AllPagesDataLoaderResponse} from '@/subfeatures/allPages/allPages.loader';
import {AllPagesView} from '@/subfeatures/allPages/AllPagesView';

export function AllPagesRoute() {
    const {pagesDataRequest} = useLoaderData() as AllPagesDataLoaderResponse;
    return (
        <React.Suspense fallback={<AllPagesView isInitialLoading={true}/>}>
            <Await
                resolve={pagesDataRequest}
                errorElement={<AwaitError/>}
            >
                {(allPagesData: PagesData) => {
                    return (
                        <AllPagesView
                            pagesData={allPagesData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
