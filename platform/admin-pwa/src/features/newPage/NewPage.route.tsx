import {Outlet} from 'react-router-dom';
import React from 'react';
import {MainSubSection} from '@/components/layouts/MainSubSection';
import {LeftSubSection} from '@/components/layouts/LeftSubSection';
import {ScrollArea} from '@/components/ui/scroll-area';
import {NavigationLink} from '@/components/utils/NavigationLink';
import {CentralSubSection} from '@/components/layouts/CentralSubSection';

export function NewPageRoute() {
    return (
        <>
            <LeftSubSection>
                <ScrollArea className="w-full h-full pr-2">
                    <div className="w-full flex flex-col gap-2 p-4">
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
                <Outlet/>
            </CentralSubSection>
        </>
    );
}