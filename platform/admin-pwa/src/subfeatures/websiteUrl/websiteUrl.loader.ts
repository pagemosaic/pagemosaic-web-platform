import {defer, ShouldRevalidateFunctionArgs} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {WebsiteUrlDataRequest, websiteUrlDataSingleton} from '@/data/WebsiteUrlData';

export type WebsiteUrlDataLoaderResponse = {
    websiteUrlDataRequest: WebsiteUrlDataRequest;
};

export async function websiteUrlLoader() {
    return defer({
        websiteUrlDataRequest: websiteUrlDataSingleton.getData()
    });
}

export function websiteUrlLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    }
    return defaultShouldRevalidate;
}
