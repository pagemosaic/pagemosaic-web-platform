import {defer, Outlet, useLoaderData, Await, LoaderFunctionArgs, redirect} from 'react-router-dom';
import {MainNavigation} from '@/roots/main/MainNavigation';
import React from 'react';
import {AwaitError} from '@/components/utils/AwaitError';
import {DelayedFallback} from '@/components/utils/DelayedFallback';
import {sysUserDataSingleton, SysUserDataRequest} from '@/data/SysUserData';
import {AccessTokenRequest, accessTokenSingleton} from '@/utils/AccessToken';
import {ToolbarSection} from '@/components/layouts/ToolbarSection';
import {CentralSection} from '@/components/layouts/CentralSection';

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
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
            <React.Suspense fallback={<DelayedFallback/>}>
                <Await
                    resolve={accessTokenRequest}
                    errorElement={<AwaitError/>}
                >
                    <>
                        <ToolbarSection>
                            <MainNavigation/>
                        </ToolbarSection>
                        <CentralSection>
                            <Outlet/>
                        </CentralSection>
                    </>
                </Await>
            </React.Suspense>
        </div>
    );
}
