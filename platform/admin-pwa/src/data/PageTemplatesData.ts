import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get} from '@/utils/ClientApi';

export type PageTemplatesData = { pageTemplateEntries: Array<DI_PageEntry>; } | null;
export type PageTemplatesDataRequest = Promise<PageTemplatesData>;

class PageTemplatesDataSingleton {
    constructor() {}

    async getAllTemplatesPages(): PageTemplatesDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<PageTemplatesData>(
                '/api/admin/get-all-page-templates',
                accessToken
            );
        }
        throw Error('Missing access token');
    }
}

// Usage
export const pageTemplatesDataSingleton = new PageTemplatesDataSingleton();
