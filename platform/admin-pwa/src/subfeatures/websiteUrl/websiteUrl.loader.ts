import {defer, ShouldRevalidateFunctionArgs} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {WebsiteUrlDataRequest, websiteDataSingleton} from '@/data/WebsiteUrlData';

export type WebsiteUrlDataLoaderResponse = {
    websiteUrlDataRequest: WebsiteUrlDataRequest;
};

export async function websiteUrlLoader() {
    return defer({
        websiteUrlDataRequest: websiteDataSingleton.getWebsiteUrlData()
    });
}

export function websiteUrlLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate, currentUrl, nextUrl} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    } else if (nextUrl.searchParams.size !== currentUrl.searchParams.size) {
        return false;
    }
    return defaultShouldRevalidate;
}
