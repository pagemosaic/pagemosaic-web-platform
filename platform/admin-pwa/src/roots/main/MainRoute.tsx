import {defer, Outlet, useLoaderData, Await, LoaderFunctionArgs, json, redirect} from 'react-router-dom';
import {MainNavigation} from '@/roots/main/MainNavigation';
import {MainAccountNavigation} from '@/roots/main/MainAccountNavigation';
import React from 'react';
import {AwaitError} from '@/components/utils/AwaitError';
import {DelayedFallback} from '@/components/utils/DelayedFallback';
import {sysUserDataSingleton, SysUserDataRequest} from '@/data/SysUserData';
import {AccessTokenRequest, accessTokenSingleton} from '@/utils/AccessToken';

export interface MainRouteLoaderResponse {
    accessTokenRequest: AccessTokenRequest;
    sysUserDataRequest: SysUserDataRequest;
}

export async function mainLoader() {
    const accessTokenRequest = accessTokenSingleton.getAccessToken();
    const sysUserDataRequest = sysUserDataSingleton.getData();
    return defer({
        accessTokenRequest,
        sysUserDataRequest
    });
}

export async function mainAction({request}: LoaderFunctionArgs) {
    switch (request.method) {
        case "POST": {
            let formData = await request.formData();
            const action = formData.get('action');
            if (action === 'logout') {
                await sysUserDataSingleton.clearData();
                accessTokenSingleton.clearAccessToken();
                return redirect('/login');
            }
            break;
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}

export function MainRoute() {
    const {accessTokenRequest} = useLoaderData() as MainRouteLoaderResponse;
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0">
            <React.Suspense fallback={<DelayedFallback />}>
                <Await
                    resolve={accessTokenRequest}
                    errorElement={<AwaitError/>}
                >
                    <div
                        className="absolute top-0 left-0 w-[240px] bottom-0 overflow-hidden border-r-[1px] border-slate-200">
                        <div className="flex flex-col h-full gap-2 justify-between">
                            <MainNavigation/>
                            <MainAccountNavigation/>
                        </div>
                    </div>
                    <div className="absolute top-0 left-[240px] bottom-0 right-0">
                        <Outlet/>
                    </div>
                </Await>
            </React.Suspense>
        </div>
    );
}
