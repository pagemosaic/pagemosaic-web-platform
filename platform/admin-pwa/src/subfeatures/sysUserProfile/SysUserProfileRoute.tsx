import {SysUserProfileData} from '@/data/SysUserProfileData';
import {useLoaderData, Await} from 'react-router-dom';
import {AwaitError} from '@/components/utils/AwaitError';
import React from 'react';
import {SysUserProfileForm} from '@/subfeatures/sysUserProfile/SysUserProfileForm';
import {SysUserProfileRouteResponse} from '@/subfeatures/sysUserProfile/sysUserProfile.loader';

export function SysUserProfileRoute() {
    const {sysUserProfileDataRequest} = useLoaderData() as SysUserProfileRouteResponse;
    return (
        <React.Suspense fallback={<SysUserProfileForm isLoadingData={true}/>}>
            <Await
                resolve={sysUserProfileDataRequest}
                errorElement={<AwaitError/>}
            >
                {(sysUserProfileData: SysUserProfileData) => {
                    return (
                        <SysUserProfileForm
                            sysUserProfileData={sysUserProfileData}
                        />
                    );
                }}
            </Await>
        </React.Suspense>
    );
}