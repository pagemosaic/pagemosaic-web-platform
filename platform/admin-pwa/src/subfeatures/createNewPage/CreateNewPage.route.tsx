import {useLoaderData, Await} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {CreateNewPageLoaderResponse} from '@/subfeatures/createNewPage/createNewPage.loader';
import {NewPageForm} from '@/subfeatures/createNewPage/NewPageForm';

export function CreateNewPageRoute() {
    const {newPageDataRequest} = useLoaderData() as CreateNewPageLoaderResponse;
    return (
        <React.Suspense fallback={<NewPageForm isLoadingData={true}/>}>
            <Await
                resolve={newPageDataRequest}
                errorElement={<AwaitError/>}
            >
                {(sessionStateKey: string) => {
                    return (
                        <NewPageForm
                            sessionStateKey={sessionStateKey}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
