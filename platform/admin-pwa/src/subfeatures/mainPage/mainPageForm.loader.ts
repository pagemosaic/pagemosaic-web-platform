import {defer, ShouldRevalidateFunctionArgs} from 'react-router-dom';
import {MainPageDataRequest, mainPageDataSingleton} from '@/data/MainPageData';
import {FORM_ACTION_SUBMIT} from '@/utils/FormUtils';

export type MainPageLoaderResponse = {
    mainPageDataRequest: MainPageDataRequest;
};

export async function mainPageFormLoader() {
    return defer({
        mainPageDataRequest: mainPageDataSingleton.getPageContent()
    });
}

export function mainPageFormLoaderGuard(args: ShouldRevalidateFunctionArgs): boolean {
    const {formData, actionResult, defaultShouldRevalidate} = args;
    if (formData && actionResult) {
        const action = formData.get('action');
        return action === FORM_ACTION_SUBMIT && !!actionResult.ok;
    }
    return defaultShouldRevalidate;
}
