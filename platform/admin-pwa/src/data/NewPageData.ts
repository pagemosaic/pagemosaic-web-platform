import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get} from '@/utils/ClientApi';
import {setSessionState} from '@/utils/localStorage';
import {initNewPageData} from '@/data/NewPageData.constans';
import {defaultPageTemplateEntry} from '@/data/PageTemplatesData.constants';

export type NewPageData = { pagesEntry: DI_PageEntry; };
export type NewPageDataRequest = Promise<string>;

class NewPageDataSingleton {
    constructor() {}

    public sessionStateKey = 'newPageData';
    public async initNewPage(options: {pageTemplateId: string;}): NewPageDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const {pageTemplateId} = options;
            if (pageTemplateId === '__new__') {
                return new Promise<string>(resolve => {
                    setTimeout(() => {
                        const result = initNewPageData(defaultPageTemplateEntry);
                        setSessionState(this.sessionStateKey, result);
                        resolve(this.sessionStateKey);
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
}

// Usage
export const newPageDataSingleton = new NewPageDataSingleton();
