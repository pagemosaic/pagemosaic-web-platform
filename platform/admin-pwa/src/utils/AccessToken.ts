import {UserToken, AuthRefreshResponse} from 'common-utils';
import {getStorageRecord, setStorageRecord} from '@/utils/localStorage';
import {post} from '@/utils/ClientApi';

const delta: number = 5 * 60 * 1000; // 5 minutes

export type AccessTokenRequest = Promise<string | undefined>;
type UserTokenSingletonInstance = UserToken | null;

export class AccessToken {
    private userToken: UserTokenSingletonInstance;
    private initializationPromise: Promise<UserTokenSingletonInstance> | null;

    constructor() {
        this.userToken = null;
        this.initializationPromise = null;
    }

    private async initialize(): Promise<void> {
        const savedUserToken: UserToken | undefined = await getStorageRecord('userToken', 'auth');
        if (savedUserToken) {
            if (this.isExpired(savedUserToken.expiredAt)) {
                const refreshResponse: AuthRefreshResponse | undefined =
                    await post<AuthRefreshResponse>('/api/post-sys-user-auth-refresh', {
                        username: savedUserToken.username,
                        refreshToken: savedUserToken.refreshToken
                    });
                if (refreshResponse && refreshResponse.userToken) {
                    await setStorageRecord(
                        'userToken',
                        {...refreshResponse.userToken, refreshToken: savedUserToken.refreshToken},
                        'auth'
                    );
                    this.userToken = refreshResponse.userToken;
                } else {
                    throw Error('User token refreshing is failed: missing response');
                }
            } else {
                this.userToken = savedUserToken;
            }
        }
    }

    private isExpired(expirationTimeUTC: number | undefined): boolean {
        if (expirationTimeUTC) {
            const expireAt = new Date(expirationTimeUTC);
            return (expireAt.getTime() - Date.now()) < delta;
        }
        return true;
    }

    private async getUserToken(): Promise<UserTokenSingletonInstance> {
        if (this.userToken && !this.isExpired(this.userToken.expiredAt)) {
            return this.userToken;
        }
        if (!this.initializationPromise) {
            this.initializationPromise = this.initialize()
                .then(() => {
                    this.initializationPromise = null;
                    return this.userToken;
                });
        }
        return this.initializationPromise;
    }

    async getAccessToken(): AccessTokenRequest {
        return this.getUserToken().then(userToken => {
            if (userToken) {
                return userToken.accessToken;
            }
            throw Error('[ACCESS_TOKEN_IS_MISSING]');
        });
    }

    clearAccessToken(): void {
        this.userToken = null;
    }
}

export const accessTokenSingleton = new AccessToken();
