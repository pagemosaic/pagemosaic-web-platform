import {useLoaderData, Await} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {CreateNewPageLoaderResponse} from '@/subfeatures/createNewPage/createNewPage.loader';
import {NewPageForm} from '@/subfeatures/createNewPage/NewPageForm';
import {NewPageData} from '@/data/NewPageData';

export function CreateNewPageRoute() {
    const {newPageDataRequest} = useLoaderData() as CreateNewPageLoaderResponse;
    return (
        <React.Suspense fallback={<NewPageForm isLoadingData={true}/>}>
            <Await
                resolve={newPageDataRequest}
                errorElement={<AwaitError/>}
            >
                {(newPageData: NewPageData) => {
                    return (
                        <NewPageForm
                            newPageData={newPageData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
