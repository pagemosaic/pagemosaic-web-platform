import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get, post} from '@/utils/ClientApi';
import {setSessionState, delSessionState} from '@/utils/localStorage';

export type EditPageData = { pageEntry: DI_PageEntry; };
export type EditPageDataRequest = Promise<string>;

class EditPageDataSingleton {
    constructor() {}

    public sessionStateKey = 'editPageData';
    public async getEditPage(options: {pageId: string;}): EditPageDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const {pageId} = options;
            return get<EditPageData>(`/api/admin/get-page?pageId=${pageId}`, accessToken)
                .then(result => {
                    if (result) {
                        setSessionState(this.sessionStateKey, result);
                        return this.sessionStateKey;
                    } else {
                        delSessionState(this.sessionStateKey);
                        throw Error('Page was not found.')
                    }
                });
        }
        throw Error('Missing access token');
    }

    public async saveEditPage(editPageData: EditPageData): Promise<void> {
        const accessToken: AccessToken= await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<any>('/api/admin/post-page', {page: editPageData.pageEntry}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }
}

// Usage
export const editPageDataSingleton = new EditPageDataSingleton();
