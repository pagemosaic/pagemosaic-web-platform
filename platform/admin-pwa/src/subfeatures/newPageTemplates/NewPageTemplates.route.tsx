import React from 'react';
import {Await, useLoaderData} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import {PageTemplatesData} from '@/data/PageTemplatesData';
import {AllPageTemplatesDataLoaderResponse} from './newPageTemplates.loader';
import {AllPageTemplatesView} from './AllPageTemplatesView';
import {LeftSubSection} from '@/components/layouts/LeftSubSection';
import {ScrollArea} from '@/components/ui/scroll-area';
import {NavigationLink} from '@/components/utils/NavigationLink';
import {CentralSubSection} from '@/components/layouts/CentralSubSection';

export function NewPageTemplatesRoute() {
    const {pageTemplatesDataRequest} = useLoaderData() as AllPageTemplatesDataLoaderResponse;
    return (
        <>
            <LeftSubSection>
                <ScrollArea className="w-full h-full">
                    <div className="w-full flex flex-col gap-2">
                        <div>
                            <NavigationLink
                                to="/new-page"
                                end={true}
                                label="All Templates"
                                className="w-full justify-start"
                            />
                        </div>
                    </div>
                </ScrollArea>
            </LeftSubSection>
            <CentralSubSection>
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
            </CentralSubSection>
        </>
    );
}
