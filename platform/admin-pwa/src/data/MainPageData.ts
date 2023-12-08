import {accessTokenSingleton} from '@/utils/AccessToken';
import {get, post} from '@/utils/ClientApi';
import {MainPage} from 'common-utils';

export type MainPageData = MainPage | undefined;
export type MainPageDataRequest = Promise<MainPageData>;

class MainPageDataSingleton {
    constructor() {}

    async getPageContent(): MainPageDataRequest {
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<MainPageData>(`/api/get-page-content?pk=Page_main&sk=Content_main`, accessToken);
        }
        throw Error('Missing access token');
    }

    async updatePageContent(formDataObject: Record<string, FormDataEntryValue | null>): Promise<void> {
        const pk = formDataObject.pk as string;
        const sk = formDataObject.sk as string;
        const page: MainPage = {
            PK: {S: pk.length > 0 ? pk : 'Page_main'},
            SK: {S: sk.length > 0 ? sk : 'Content_main'},
            Title: {S: formDataObject.title as string},
            HeroTitle: {S: formDataObject.heroTitle as string},
            Body: {S: formDataObject.body as string}
        };
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<MainPageData>('/api/post-page-content', {page}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }
}

// Usage
export const mainPageDataSingleton = new MainPageDataSingleton();
