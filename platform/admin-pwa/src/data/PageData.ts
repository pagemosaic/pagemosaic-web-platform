import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get, post} from '@/utils/ClientApi';
import {setSessionState, delSessionState} from '@/utils/localStorage';
import {initNewPageData} from '@/data/NewPageData.constans';
import {defaultPageTemplateEntry} from '@/data/PageTemplatesData.constants';

export type PageData = { pageEntry: DI_PageEntry; };
export type PageDataRequest = Promise<string>;

class PageDataSingleton {
    constructor() {}

    public sessionStateKeyForEdit = 'editPageData';
    public sessionStateKeyForNew = 'newPageData';
    public async getEditPage(options: {pageId: string;}): PageDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const {pageId} = options;
            return get<PageData>(`/api/admin/get-page?pageId=${pageId}`, accessToken)
                .then(result => {
                    if (result) {
                        setSessionState(this.sessionStateKeyForEdit, result);
                        return this.sessionStateKeyForEdit;
                    } else {
                        delSessionState(this.sessionStateKeyForEdit);
                        throw Error('Page was not found.')
                    }
                });
        }
        throw Error('Missing access token');
    }

    public async initNewPage(options: {pageTemplateId: string;}): PageDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const {pageTemplateId} = options;
            if (pageTemplateId === '__new__') {
                return new Promise<string>(resolve => {
                    setTimeout(() => {
                        const result = initNewPageData(defaultPageTemplateEntry);
                        setSessionState(this.sessionStateKeyForNew, result);
                        resolve(this.sessionStateKeyForNew);
                    }, 1000);
                });
            }
            throw Error('Not implemented');
            // return get<NewPageData>(
            //     `/api/admin/get-all-pages?entryType=${entryType || ''}&tagId=${tagId || ''}`,
            //     accessToken
            // );
        }
        throw Error('Missing access token');
    }

    public async savePage(pageData: PageData): Promise<void> {
        const accessToken: AccessToken= await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<any>('/api/admin/post-page', {page: pageData.pageEntry}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }
}

export const pageDataSingleton = new PageDataSingleton();
