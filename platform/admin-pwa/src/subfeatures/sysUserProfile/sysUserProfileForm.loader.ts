import {defer, ShouldRevalidateFunctionArgs} from 'react-router-dom';
import {sysUserProfileDataSingleton, SysUserProfileDataRequest} from '@/data/SysUserProfileData';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';

export type SysUserProfileRouteResponse = {
    sysUserProfileDataRequest: SysUserProfileDataRequest;
};

export async function sysUserProfileFormLoader() {
    return defer({
        sysUserProfileDataRequest: sysUserProfileDataSingleton.getData()
    });
}

export function sysUserProfileFormLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    }
    return defaultShouldRevalidate;
}
