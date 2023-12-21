import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get} from '@/utils/ClientApi';

export type NewPageData = { pagesEntry: DI_PageEntry; };
export type NewPageDataRequest = Promise<NewPageData>;

class NewPageDataSingleton {
    constructor() {}

    async initNewPage(options: {pageTemplateId: string;}): NewPageDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const {pageTemplateId} = options;
            return new Promise<NewPageData>(resolve => {
                setTimeout(() => {
                    resolve({
                        pagesEntry: {
                            Meta: {
                                PK: {S: ''},
                                SK: {S: ''},
                                MetaTitle: {S: `From ${pageTemplateId}`},
                                MetaDescription: {S: 'Some description'},
                                MetaRoute: {S: ''},
                                MetaSlug: {S: ''}
                            }
                        }
                    });
                }, 2000);
            });
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
