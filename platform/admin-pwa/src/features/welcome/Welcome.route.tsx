import {ToolbarSection} from '@/components/layouts/ToolbarSection';
import {CentralSection} from '@/components/layouts/CentralSection';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Link} from 'react-router-dom';
import {CentralSubSection} from '@/components/layouts/CentralSubSection';
import {LeftSubSection} from '@/components/layouts/LeftSubSection';
import {NavigationLink} from '@/components/utils/NavigationLink';
import React from 'react';

export function WelcomeRoute() {
    return (
        <>
            <LeftSubSection>
                <ScrollArea className="w-full h-full">
                    <div className="w-full flex flex-col gap-2">
                        <div>
                            <NavigationLink
                                to="/pages/main-page"
                                end={true}
                                label="Home Page Content"
                                className="w-full justify-start"
                            />
                        </div>
                        <div>
                            <NavigationLink
                                to="/settings/sys-user-profile"
                                end={true}
                                label="System User Profile"
                                className="w-full justify-start"
                            />
                        </div>
                    </div>
                </ScrollArea>
            </LeftSubSection>
            <CentralSubSection>
                <ScrollArea className="w-full h-full p-4">
                    <div className="w-full flex flex-col gap-4 items-center">
                        <div>
                            <h2 className="text-xl">Welcome</h2>
                        </div>
                        <div>
                            <p className="text-sm">The platform has two features so far</p>
                        </div>
                    </div>
                </ScrollArea>
            </CentralSubSection>
        </>
    );
}