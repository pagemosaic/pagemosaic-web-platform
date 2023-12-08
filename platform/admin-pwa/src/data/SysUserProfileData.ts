import {accessTokenSingleton} from '@/utils/AccessToken';
import {get, post} from '@/utils/ClientApi';
import {UserProfile} from 'common-utils';

export type SysUserProfileData = UserProfile | undefined;
export type SysUserProfileDataRequest = Promise<SysUserProfileData>;

class SysUserProfileDataSingleton {
    private instance: SysUserProfileData;
    private initializationPromise: SysUserProfileDataRequest | undefined;
    private expirationPeriod: number;
    private expirationTime: number | undefined;
    constructor(expirationPeriod: number) {
        this.instance = undefined;
        this.initializationPromise = undefined;
        this.expirationPeriod = expirationPeriod; // in milliseconds
        this.expirationTime = undefined;
    }

    private async initialize(): SysUserProfileDataRequest {
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            const userProfile = await get<UserProfile | undefined>('/api/get-sys-user-profile', accessToken);
            if (userProfile) {
                return userProfile;
            }
            return undefined;
        }
        throw Error('Missing access token');
    }

    private hasExpired(): boolean {
        return !this.expirationTime || Date.now() > this.expirationTime;
    }

    async getData(): SysUserProfileDataRequest {
        if (this.instance && !this.hasExpired()) {
            return this.instance;
        }
        if (!this.initializationPromise) {
            this.initializationPromise = this.initialize().then((instance: SysUserProfileData) => {
                this.instance = instance;
                this.expirationTime = Date.now() + this.expirationPeriod;
                this.initializationPromise = undefined;
                return instance;
            });
        }
        return this.initializationPromise;
    }

    async setData(formDataObject: Record<string, FormDataEntryValue | null>): Promise<void> {
        const userProfile: UserProfile = {
            PK: {S: formDataObject.pk as string},
            SK: {S: formDataObject.sk as string},
            UserEmail: {S: formDataObject.email as string},
            UserFullName: {S: formDataObject.fullName as string}
        };
        const accessToken: string | undefined = await accessTokenSingleton.getAccessToken();
        if (accessToken) {
            await post<any>('/api/post-sys-user-profile', {profile: userProfile}, accessToken);
            this.instance = undefined;
            return;
        }
        throw Error('Missing access token');
    }
}

// Usage
const expirationPeriod = 5 * 60000; // 5 minutes
export const sysUserProfileDataSingleton = new SysUserProfileDataSingleton(expirationPeriod);
