import {Outlet} from 'react-router-dom';
import {LeftSubSection} from '@/components/layouts/LeftSubSection';
import {ScrollArea} from '@/components/ui/scroll-area';
import {CentralSubSection} from '@/components/layouts/CentralSubSection';
import React from 'react';
import {NavigationLink} from '@/components/utils/NavigationLink';

export function SettingsRoute() {
    return (
        <>
            <LeftSubSection>
                <ScrollArea className="w-full h-full">
                    <div className="w-full flex flex-col gap-2">
                        <div>
                            <NavigationLink
                                to="/settings/website-url"
                                label="Website Address (URL)"
                                className="w-full justify-start"
                            />
                        </div>
                        <div>
                            <NavigationLink
                                to="/settings/sys-user-profile"
                                label="System User"
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