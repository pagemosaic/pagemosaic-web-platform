import {accessTokenSingleton} from '@/utils/AccessToken';
import {get} from '@/utils/ClientApi';

export type ProbeData = {name: string} | undefined;
export type ProbeDataRequest = Promise<ProbeData>;

class ProbeDataSingleton {
    private instance: ProbeData;
    private initializationPromise: ProbeDataRequest | undefined;
    private expirationPeriod: number;
    private expirationTime: number | undefined;
    constructor(expirationPeriod: number) {
        this.instance = undefined;
        this.initializationPromise = undefined;
        this.expirationPeriod = expirationPeriod; // in milliseconds
        this.expirationTime = undefined;
    }

    private async initialize(): ProbeDataRequest {
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            return get<ProbeData>('/api/get-probe-data');
        }
        throw Error('Missing access token');
    }

    private hasExpired(): boolean {
        return !this.expirationTime || Date.now() > this.expirationTime;
    }

    async getData(): ProbeDataRequest {
        if (this.instance && !this.hasExpired()) {
            return this.instance;
        }
        if (!this.initializationPromise) {
            this.initializationPromise = this.initialize().then((instance: ProbeData) => {
                this.instance = instance;
                this.expirationTime = Date.now() + this.expirationPeriod;
                this.initializationPromise = undefined;
                return instance;
            });
        }
        return this.initializationPromise;
    }
}

// Usage
const expirationPeriod = 5000; // 5 seconds for demonstration
export const probeDataSingleton = new ProbeDataSingleton(expirationPeriod);
