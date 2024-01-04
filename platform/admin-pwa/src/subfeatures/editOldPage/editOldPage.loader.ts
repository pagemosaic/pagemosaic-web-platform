import {defer, ShouldRevalidateFunctionArgs, LoaderFunctionArgs, redirect} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {EditPageDataRequest, editPageDataSingleton} from '@/data/EditPageData';

export type EditOldPageLoaderResponse = {
    editPageDataRequest: EditPageDataRequest;
};

export async function editOldPageLoader({params}: LoaderFunctionArgs) {
    if (params.pageId) {
        return defer({
            editPageDataRequest: editPageDataSingleton.getEditPage({pageId: params.pageId})
        });
    }
    return redirect('/pages');
}

export function editOldPageLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        console.log('Reload: ', action === FORM_ACTION_SUBMIT && !!actionResult.ok);
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    }
    console.log('Reload: ', defaultShouldRevalidate);
    return defaultShouldRevalidate;
}
