import {useLoaderData, Await} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {EditOldPageLoaderResponse} from './editOldPage.loader';
import {EditOldPageForm} from './EditOldPageForm';

export function EditOldPageRoute() {
    const {editPageDataRequest} = useLoaderData() as EditOldPageLoaderResponse;
    return (
        <React.Suspense fallback={<EditOldPageForm isLoadingData={true}/>}>
            <Await
                resolve={editPageDataRequest}
                errorElement={<AwaitError/>}
            >
                {(sessionStateKey: string) => {
                    return (
                        <EditOldPageForm
                            sessionStateKey={sessionStateKey}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
