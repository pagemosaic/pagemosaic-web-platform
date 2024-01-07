import {useLoaderData, Await} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {FilesFinderLoaderResponse} from '@/subfeatures/filesFinder/filesFinder.loader';
import {UserBucketData} from '@/data/UserBucketData';
import {FilesFinder} from '@/subfeatures/filesFinder/FilesFinder';
import {AsyncStatusProvider} from '@/components/utils/AsyncStatusProvider';

export function FilesFinderRoute() {
    const {userBucketDataRequest} = useLoaderData() as FilesFinderLoaderResponse;
    console.log('Render FilesFinderRoute');
    return (
        <React.Suspense fallback={<span>Loading...</span>}>
            <Await
                resolve={userBucketDataRequest}
                errorElement={<AwaitError/>}
            >
                {(userBucketData: UserBucketData) => {
                    console.log('Render FilesFinder');
                    return (
                        <AsyncStatusProvider>
                            <FilesFinder userBucketData={userBucketData} />
                        </AsyncStatusProvider>
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
