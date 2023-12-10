import {accessTokenSingleton} from '@/utils/AccessToken';
import {get, post} from '@/utils/ClientApi';
import {PlatformWebsiteUrl} from 'common-utils';

export type WebsiteUrlData = PlatformWebsiteUrl | undefined;
export type WebsiteUrlDataRequest = Promise<WebsiteUrlData>;

class WebsiteUrlDataSingleton {
    constructor() {}

    async getData(): WebsiteUrlDataRequest {
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<WebsiteUrlData>(`/api/get-website-url`, accessToken);
        }
        throw Error('Missing access token');
    }

    async setCustomDomain(formDataObject: Record<string, FormDataEntryValue | null>): Promise<void> {
        const customDomainName = formDataObject.customDomainName as string;
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<any>('/api/post-custom-domain', {customDomainName}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }
}

// Usage
export const websiteUrlDataSingleton = new WebsiteUrlDataSingleton();
