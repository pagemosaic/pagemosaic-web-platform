import {defer, ShouldRevalidateFunctionArgs, LoaderFunctionArgs, redirect} from 'react-router-dom';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';
import {NewPageDataRequest, newPageDataSingleton} from '@/data/NewPageData';

export type CreateNewPageLoaderResponse = {
    newPageDataRequest: NewPageDataRequest;
};

export async function createNewPageLoader({params}: LoaderFunctionArgs) {
    if (params.templateId) {
        return defer({
            newPageDataRequest: newPageDataSingleton.initNewPage({pageTemplateId: params.templateId})
        });
    }
    return redirect('/new-page');
}

export function createNewPageLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    }
    return defaultShouldRevalidate;
}
