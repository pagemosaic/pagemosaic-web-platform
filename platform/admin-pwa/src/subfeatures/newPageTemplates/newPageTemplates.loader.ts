import {defer, ShouldRevalidateFunctionArgs, LoaderFunctionArgs} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {PageTemplatesDataRequest, pageTemplatesDataSingleton} from '@/data/PageTemplatesData';

export type AllPageTemplatesDataLoaderResponse = {
    pageTemplatesDataRequest: PageTemplatesDataRequest;
};

export async function allPageTemplatesLoader({request}: LoaderFunctionArgs) {
    return defer({
        pageTemplatesDataRequest: pageTemplatesDataSingleton.getAllTemplatesPages()
    });
}

export function allPageTemplatesLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate, currentUrl, nextUrl} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    } else if (nextUrl.searchParams.size !== currentUrl.searchParams.size) {
        return false;
    }
    return defaultShouldRevalidate;
}
