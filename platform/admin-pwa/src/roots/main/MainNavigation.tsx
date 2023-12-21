import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {LucideSettings, LucideBookOpen, LucideIcon, LucidePlus, LucideFilePlus2} from 'lucide-react';
import {NavigationMenuList, NavigationMenuItem, NavigationMenu} from '@/components/ui/navigation-menu';
import {MainAccountNavigation} from '@/roots/main/MainAccountNavigation';
import {NavigationButtonLink} from '@/components/utils/NavigationButtonLink';
import {getSessionState, setSessionState} from '@/utils/localStorage';

type RouteMeta = {
    key: string;
    defaultKey: string;
    stateKey: string;
    label: string;
    Icon: LucideIcon
};

const navigationRoutesMeta: Array<RouteMeta> = [
    {
        key: '/pages',
        defaultKey: '/pages',
        stateKey: 'pagesPath',
        label: 'Pages',
        Icon: LucideBookOpen
    },
    {
        key: '/settings',
        defaultKey: '/settings/website-url',
        stateKey: 'settingsPath',
        label: 'Settings',
        Icon: LucideSettings
    },
    {
        key: '/new-page',
        defaultKey: '/new-page',
        stateKey: 'newPagePath',
        label: 'Add New Page',
        Icon: LucideFilePlus2
    }
];

function findRouteMeta(pathname: string): RouteMeta | undefined {
    return navigationRoutesMeta.find(i => pathname.startsWith(i.key));
}

export function MainNavigation() {
    let location = useLocation();

    useEffect(() => {
        const {pathname} = location;
        const mainNavigationCurrentPaths = getSessionState('mainNavigationCurrentPaths');
        const routeMeta: RouteMeta | undefined = findRouteMeta(pathname);
        if (routeMeta && pathname.length - routeMeta.key.length > 2) {
            setSessionState('mainNavigationCurrentPaths', {
                ...mainNavigationCurrentPaths, [routeMeta.stateKey]: location.pathname
            });
        }
    }, [location]);

    const mainNavigationCurrentPaths = getSessionState('mainNavigationCurrentPaths');

    return (
        <div className="flex flex-row justify-between">
            <NavigationMenu>
                <NavigationMenuList>
                    {navigationRoutesMeta.map(navItem => {
                        return (
                            <NavigationMenuItem key={navItem.key} asChild={true}>
                                <NavigationButtonLink
                                    pathKey={navItem.key}
                                    to={mainNavigationCurrentPaths[navItem.stateKey] || navItem.defaultKey}
                                    end={false}
                                    label={navItem.label}
                                    className="w-full justify-start"
                                    icon={<navItem.Icon className="h-3 w-3"/>}
                                />
                            </NavigationMenuItem>
                        );
                    })}
                </NavigationMenuList>
            </NavigationMenu>
            <MainAccountNavigation/>
        </div>
    );
}