import {accessTokenSingleton} from '@/utils/AccessToken';
import {get} from '@/utils/ClientApi';

export type PreviewData = {domain: string} | undefined;
export type PreviewDataRequest = Promise<PreviewData>;

class PreviewDataSingleton {
    private instance: PreviewData;
    private initializationPromise: PreviewDataRequest | undefined;
    constructor() {
        this.instance = undefined;
        this.initializationPromise = undefined;
    }

    private async initialize(): PreviewDataRequest {
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<PreviewData>('/api/get-preview', accessToken);
        }
        throw Error('Missing access token');
    }

    async getData(): PreviewDataRequest {
        if (this.instance) {
            return this.instance;
        }
        if (!this.initializationPromise) {
            this.initializationPromise = this.initialize().then((instance: PreviewData) => {
                this.instance = instance;
                this.initializationPromise = undefined;
                return instance;
            });
        }
        return this.initializationPromise;
    }
}

export const previewDataSingleton = new PreviewDataSingleton();
