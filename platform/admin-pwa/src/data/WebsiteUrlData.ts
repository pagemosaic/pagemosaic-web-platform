import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get, post, del, ClientControllerCallback} from '@/utils/ClientApi';
import {PlatformWebsiteUrl, PlatformWebsiteSslCertificateDetails} from 'common-utils';
import {useGetData, GetDataStatus} from '@/data/hooks';

export type WebsiteUrlData = PlatformWebsiteUrl | null;
export type WebsiteUrlDataRequest = Promise<WebsiteUrlData>;

class WebsiteDataSingleton {
    constructor() {}

    async getWebsiteUrlData(controllerCb?: ClientControllerCallback): WebsiteUrlDataRequest {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<WebsiteUrlData>('/api/admin/get-website-url', accessToken, controllerCb);
        }
        throw Error('Missing access token');
    }

    async setCustomDomainCertificate(formDataObject: Record<string, FormDataEntryValue | null>): Promise<void> {
        const customDomainName = formDataObject.customDomainName as string;
        const accessToken: AccessToken= await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<any>('/api/admin/post-custom-domain-certificate', {customDomainName}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }

    async setCustomDomainDistribution(): Promise<void> {
        const accessToken: AccessToken= await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<any>('/api/admin/post-custom-domain-distribution', {}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }

    async deleteCustomDomain(): Promise<void> {
        const accessToken: AccessToken= await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await del<any>('/api/admin/delete-custom-domain', {}, accessToken);
            return;
        }
        throw Error('Missing access token');
    }
}

// Usage
export const websiteDataSingleton = new WebsiteDataSingleton();

export function useWebsiteSslCertificateDetailsData({skip = false, interval = 0}: {skip?: boolean, interval?: number}): {
    websiteSslCertificateDetailsData: PlatformWebsiteSslCertificateDetails | null,
    websiteSslCertificateDetailsError?: string,
    websiteSslCertificateDetailsStatus: GetDataStatus,
    websiteSslCertificateDetailsRefresh: () => void
} {
    const {data, error, status, refresh} = useGetData<PlatformWebsiteSslCertificateDetails>(
        '/api/admin/get-website-ssl-certificate-details',
        {skip, interval}
    );
    return {
        websiteSslCertificateDetailsData: data,
        websiteSslCertificateDetailsError: error,
        websiteSslCertificateDetailsStatus: status,
        websiteSslCertificateDetailsRefresh: refresh
    };
}
