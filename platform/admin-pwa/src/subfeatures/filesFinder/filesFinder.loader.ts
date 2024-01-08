import {defer, ShouldRevalidateFunctionArgs} from 'react-router-dom';
import {UserBucketDataRequest, userBucketDataSingleton} from '@/data/UserBucketData';

export type FilesFinderLoaderResponse = {
    userBucketDataRequest: UserBucketDataRequest;
};

export async function filesFinderLoader() {
    return defer({
        userBucketDataRequest: userBucketDataSingleton.getPublicFiles()
    });
}

export function filesFinderLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action') as string;
        return ['addFolder', 'deleteFiles'].includes(action) && !!actionResult.ok;
    }
    return defaultShouldRevalidate;
}
