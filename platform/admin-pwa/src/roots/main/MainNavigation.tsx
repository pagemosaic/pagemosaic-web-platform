import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {
    LucideSettings,
    LucideBookOpen,
    LucideIcon,
    LucidePlus,
    LucideFilePlus2,
    LucideFiles,
    LucideLayoutDashboard
} from 'lucide-react';
import {NavigationMenuList, NavigationMenuItem, NavigationMenu} from '@/components/ui/navigation-menu';
import {MainAccountNavigation} from '@/roots/main/MainAccountNavigation';
import {NavigationButtonLink} from '@/components/utils/NavigationButtonLink';
import {getSessionState, setSessionState} from '@/utils/localStorage';
import * as constants from 'constants';
import {PLATFORM_STACK_NAME} from 'infra-common/constants';

type RouteMeta = {
    key: string;
    defaultKey: string;
    stateKey: string;
    label: string;
    Icon: LucideIcon;
    isCommand?: boolean;
};

const navigationRoutesMeta: Array<RouteMeta> = [
    {
        key: '/new-page',
        defaultKey: '/new-page',
        stateKey: 'newPagePath',
        label: 'Add New Page',
        Icon: LucideFilePlus2,
        isCommand: true,
    },
    {
        key: '/pages',
        defaultKey: '/pages',
        stateKey: 'pagesPath',
        label: 'Pages',
        Icon: LucideBookOpen
    },
    {
        key: '/files',
        defaultKey: '/files',
        stateKey: 'filesPath',
        label: 'Files',
        Icon: LucideFiles,
        isCommand: true,
    },
    {
        key: '/settings',
        defaultKey: '/settings/website-url',
        stateKey: 'settingsPath',
        label: 'Settings',
        Icon: LucideSettings
    },
];

function findRouteMeta(pathname: string): RouteMeta | undefined {
    return navigationRoutesMeta.find(i => pathname.startsWith(i.key));
}

export function MainNavigation() {
    let location = useLocation();

    useEffect(() => {
        const {pathname} = location;
        const mainNavigationCurrentPaths = getSessionState('mainNavigationCurrentPaths') || {};
        const routeMeta: RouteMeta | undefined = findRouteMeta(pathname);
        if (routeMeta && !routeMeta.isCommand && pathname.length - routeMeta.key.length > 2) {
            setSessionState('mainNavigationCurrentPaths', {
                ...mainNavigationCurrentPaths, [routeMeta.stateKey]: location.pathname
            });
        }
    }, [location]);

    const mainNavigationCurrentPaths: Record<string, string> = getSessionState('mainNavigationCurrentPaths') || {};

    return (
        <div className="flex flex-row justify-between items-center px-4 py-2">
            <div className="flex flex-row gap-2 items-center">
                <LucideLayoutDashboard className="w-5 h-5" />
                <p className="text-xl">{PLATFORM_STACK_NAME}</p>
            </div>
            <div className="flex flex-row items-center">
            <NavigationMenu>
                <NavigationMenuList>
                    {navigationRoutesMeta.map(navItem => {
                        return (
                            <NavigationMenuItem key={navItem.key} asChild={true}>
                                <NavigationButtonLink
                                    pathKey={navItem.key}
                                    to={navItem.isCommand
                                        ? navItem.defaultKey
                                        : mainNavigationCurrentPaths[navItem.stateKey] || navItem.defaultKey
                                    }
                                    end={false}
                                    label={navItem.label}
                                    className="w-full justify-start"
                                    icon={<navItem.Icon className="h-4 w-4"/>}
                                />
                            </NavigationMenuItem>
                        );
                    })}
                </NavigationMenuList>
            </NavigationMenu>
            <MainAccountNavigation/>
            </div>
        </div>
    );
}