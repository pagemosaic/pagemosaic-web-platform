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
                <ScrollArea className="w-full h-full">
                    <div className="w-full flex flex-col gap-2">
                        <div>
                            <NavigationLink
                                to="/pages/main-page"
                                end={true}
                                label="Home"
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