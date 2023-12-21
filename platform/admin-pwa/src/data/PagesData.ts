import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get} from '@/utils/ClientApi';

export type PagesData = { pagesEntries: Array<DI_PageEntry>; } | null;
export type PagesDataRequest = Promise<PagesData>;

class PagesDataSingleton {
    constructor() {}

    async getAllPages(options: {entryType?: string; tagId?: string;}): PagesDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const {entryType, tagId} = options;
            return get<PagesData>(
                `/api/admin/get-all-pages?entryType=${entryType || ''}&tagId=${tagId || ''}`,
                accessToken
            );
        }
        throw Error('Missing access token');
    }
}

// Usage
export const pagesDataSingleton = new PagesDataSingleton();
