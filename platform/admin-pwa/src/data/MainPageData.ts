import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get, post} from '@/utils/ClientApi';
import {MainPage} from 'infra-common/data/MainPage';

export type MainPageData = MainPage | null;
export type MainPageDataRequest = Promise<MainPageData>;

class MainPageDataSingleton {
    constructor() {}

    async getPageContent(): MainPageDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<MainPageData>(`/api/admin/get-page-content?pk=Page_main&sk=Content_main`, accessToken);
        }
        throw Error('Missing access token');
    }

    async updatePageContent(formDataObject: Record<string, FormDataEntryValue | null>): Promise<void> {
        const pk = formDataObject.pk as string;
        const sk = formDataObject.sk as string;
        const page: MainPage = {
            PK: {S: pk.length > 0 ? pk : 'Page_main'},
            SK: {S: sk.length > 0 ? sk : 'Content_main'},
            PageTitle: {S: formDataObject.pageTitle as string},
            PageDescription: {S: formDataObject.pageDescription as string},
            PageBody: {S: formDataObject.pageBody as string}
        };
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<MainPageData>('/api/admin/post-page-content', {page}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }
}

// Usage
export const mainPageDataSingleton = new MainPageDataSingleton();
