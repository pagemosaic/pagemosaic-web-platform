import {Outlet} from 'react-router-dom';
import React from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {LeftSubSection} from '@/components/layouts/LeftSubSection';
import {CentralSubSection} from '@/components/layouts/CentralSubSection';
import {NavigationLink} from '@/components/utils/NavigationLink';

export function PagesRoute() {
    return (
        <>
            <LeftSubSection>
                <ScrollArea className="w-full h-full pr-2">
                    <div className="w-full flex flex-col gap-2 p-4">
                        {/*<div>*/}
                        {/*    <NavigationLink*/}
                        {/*        to="/pages"*/}
                        {/*        end={true}*/}
                        {/*        label="All Pages"*/}
                        {/*        className="w-full justify-start"*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div>
                            <NavigationLink
                                to="/pages?entryType=main_page"
                                end={true}
                                label="Home Page"
                                className="w-full justify-start"
                            />
                        </div>
                        <div>
                            <NavigationLink
                                to="/pages?entryType=page"
                                end={true}
                                label="All Pages"
                                className="w-full justify-start"
                            />
                        </div>
                    </div>
                </ScrollArea>
            </LeftSubSection>
            <CentralSubSection>
                <Outlet/>
            </CentralSubSection>
        </>
    );
}