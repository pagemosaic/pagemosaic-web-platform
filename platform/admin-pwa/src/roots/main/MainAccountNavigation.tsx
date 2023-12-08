import {LucideUserCircle, LucideRotateCcw} from 'lucide-react';
import React from 'react';
import {Await, useRouteLoaderData, Link, useFetcher} from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {AwaitError} from '@/components/utils/AwaitError';
import {MainRouteLoaderResponse} from '@/roots/main/MainRoute';
import {SysUserData} from '@/data/SysUserData';

export function MainAccountNavigation() {
    const {sysUserDataRequest} = useRouteLoaderData('main') as MainRouteLoaderResponse;
    const fetcher = useFetcher();
    return (
        <div className="p-4">
            <React.Suspense
                fallback={
                    <Button size="sm" variant="ghost" className="w-full justify-start" disabled>
                        <LucideRotateCcw className="mr-2 h-3 w-3 animate-spin"/>
                        Loading...
                    </Button>
                }
            >
                <Await
                    resolve={sysUserDataRequest}
                    errorElement={<AwaitError />}
                >
                    {(sysUserData: SysUserData) => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="w-full justify-start">
                                    <LucideUserCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                                    {sysUserData.userAttributes?.email || 'undefined'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent collisionPadding={{top: 10, left: 10}} className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onSelect={() => {
                                        fetcher.submit(
                                            { action: 'logout' },
                                            { method: "post" }
                                        )
                                    }}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </Await>
            </React.Suspense>
        </div>
    );
}
