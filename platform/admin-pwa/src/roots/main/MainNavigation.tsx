import {ButtonLink} from '@/components/utils/ButtonLink';
import {LucideSettings, LucideBookOpen} from 'lucide-react';
import {NavigationMenuList, NavigationMenuItem, NavigationMenu} from '@/components/ui/navigation-menu';
import {MainAccountNavigation} from '@/roots/main/MainAccountNavigation';

export function MainNavigation() {
    return (
        <div className="flex flex-row justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem asChild={true}>
                        <ButtonLink
                            to="/pages"
                            end={false}
                            label="Pages"
                            className="w-full justify-start"
                            icon={<LucideBookOpen className="h-3 w-3"/>}
                        />
                    </NavigationMenuItem>
                    <NavigationMenuItem asChild={true}>
                        <ButtonLink
                            to="/settings"
                            end={false}
                            label="Settings"
                            className="w-full justify-start"
                            icon={<LucideSettings className="h-3 w-3"/>}
                        />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <MainAccountNavigation/>
        </div>
    );
}