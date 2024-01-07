import {defer, ShouldRevalidateFunctionArgs, LoaderFunctionArgs, redirect} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {PageDataRequest, pageDataSingleton} from '@/data/PageData';

export type EditOldPageLoaderResponse = {
    editPageDataRequest: PageDataRequest;
};

export async function editOldPageLoader({params}: LoaderFunctionArgs) {
    if (params.pageId) {
        return defer({
            editPageDataRequest: pageDataSingleton.getEditPage({pageId: params.pageId})
        });
    }
    return redirect('/pages');
}

export function editOldPageLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    }
    return defaultShouldRevalidate;
}
