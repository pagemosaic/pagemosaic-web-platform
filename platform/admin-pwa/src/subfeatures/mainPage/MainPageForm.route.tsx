import {useLoaderData, Await} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {MainPageLoaderResponse} from '@/subfeatures/mainPage/mainPageForm.loader';
import {MainPageForm} from '@/subfeatures/mainPage/MainPageForm';
import {MainPageData} from '@/data/MainPageData';

export function MainPageFormRoute() {
    const {mainPageDataRequest} = useLoaderData() as MainPageLoaderResponse;
    return (
        <React.Suspense fallback={<MainPageForm isLoadingData={true}/>}>
            <Await
                resolve={mainPageDataRequest}
                errorElement={<AwaitError/>}
            >
                {(mainPageData: MainPageData) => {
                    return (
                        <MainPageForm
                            mainPageData={mainPageData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}
