import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get} from '@/utils/ClientApi';
import {defaultPageTemplateEntry} from '@/data/PageTemplatesData.constants';

export type PageTemplatesData = { pageTemplateEntries: Array<DI_PageEntry>; } | null;
export type PageTemplatesDataRequest = Promise<PageTemplatesData>;

class PageTemplatesDataSingleton {
    constructor() {}

    async getAllTemplatesPages(): PageTemplatesDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            let result: PageTemplatesData = await get<PageTemplatesData>(
                '/api/admin/get-all-page-templates',
                accessToken
            );
            result = result || {pageTemplateEntries: []};
            result.pageTemplateEntries.push(defaultPageTemplateEntry);
            return result;
        }
        throw Error('Missing access token');
    }
}

// Usage
export const pageTemplatesDataSingleton = new PageTemplatesDataSingleton();
