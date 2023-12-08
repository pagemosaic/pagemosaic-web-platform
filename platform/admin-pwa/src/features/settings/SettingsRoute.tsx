import {Outlet} from 'react-router-dom';
import {NavigationMenu, NavigationMenuList, NavigationMenuItem} from '@/components/ui/navigation-menu';
import {ToolbarSection} from '@/components/layouts/ToolbarSection';
import {CentralSection} from '@/components/layouts/CentralSection';
import {ButtonLink} from '@/components/utils/ButtonLink';

export function SettingsRoute() {
    return (
        <>
            <ToolbarSection>
                <div className="flex flex-row justify-between">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem asChild={true}>
                                <ButtonLink
                                    to="/settings/sys-user-profile"
                                    end={true}
                                    label="System User"
                                    className="w-full justify-start"
                                />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </ToolbarSection>
            <CentralSection>
                <Outlet />
            </CentralSection>
        </>
    );
}