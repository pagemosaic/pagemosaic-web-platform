import {defer, ShouldRevalidateFunctionArgs, LoaderFunctionArgs} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {PagesDataRequest, pagesDataSingleton} from '@/data/PagesData';

export type AllPagesDataLoaderResponse = {
    pagesDataRequest: PagesDataRequest;
};

export async function allPagesLoader({request}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const entryType: string | undefined = url.searchParams.get('entryType') || undefined;
    const tagId: string | undefined = url.searchParams.get('tagId') || undefined;
    return defer({
        pagesDataRequest: pagesDataSingleton.getAllPages({entryType, tagId})
    });
}

export function allPagesLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate, currentUrl, nextUrl} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    } else if (nextUrl.searchParams.size !== currentUrl.searchParams.size) {
        return false;
    }
    return defaultShouldRevalidate;
}
