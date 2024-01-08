import {accessTokenSingleton, AccessToken} from '@/utils/AccessTokenSingleton';
import {get, post, putFile1} from '@/utils/ClientApi';
import {FileObject, TreeNode} from 'infra-common/system/Bucket';
import {listToTree, setParentReferences} from '@/utils/FileObjectUtils';

export type UserBucketData = { publicFilesRoots: Array<TreeNode>; } | null;
export type UserBucketDataRequest = Promise<UserBucketData>;

class UserBucketDataSingleton {
    constructor() {
    }

    async getPublicFiles(): UserBucketDataRequest {
        return accessTokenSingleton.getAccessToken()
            .then((accessToken: AccessToken) => {
                if (accessToken) {
                    return get<{ publicFiles: Array<FileObject>; }>(
                        '/api/admin/get-public-files',
                        accessToken
                    )
                        .then((result) => {
                            let publicFilesRoots: Array<TreeNode> = [];
                            if (result) {
                                const {publicFiles} = result;
                                publicFilesRoots = listToTree(publicFiles);
                                if (publicFilesRoots && publicFilesRoots.length > 0) {
                                    for (const filesRoot of publicFilesRoots) {
                                        setParentReferences(filesRoot);
                                    }
                                }
                            }
                            return {
                                publicFilesRoots
                            };
                        })
                }
                throw Error('Missing access token');
            });
    }

    async uploadPublicFiles(
        files: Array<File>,
        progressCB: (complete: number, total: number, cancel: () => void) => void,
        rootPath?: string
    ): Promise<void> {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (!accessToken) {
            throw Error('Missing access token');
        }

        let totalSize = 0;
        for (const fileItem of files) {
            totalSize += fileItem.size;
        }
        let uploadedSize = 0;
        for (const fileItem of files) {
            const postResult = await post<{ url: string }>(`/api/admin/post-add-public-file`, {
                filePath: rootPath ? `${rootPath}/${fileItem.name}` : fileItem.name
            }, accessToken);
            if (postResult) {
                const {url} = postResult;
                const wrappedProgressCB = (progress: number, cancel: () => void) => {
                    const cumulativeProgress = uploadedSize + progress;
                    progressCB(cumulativeProgress, totalSize, cancel);
                };
                await putFile1(url, fileItem, wrappedProgressCB);
                uploadedSize += fileItem.size;
            }
        }
    };

    async addFolder(rootPath: string): Promise<void> {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (!accessToken) {
            throw Error('Missing access token');
        }
        const postResult = await post<{ url: string }>(`/api/admin/post-add-public-file`, {
            filePath: `${rootPath}/`
        }, accessToken);
        if (postResult) {
            const {url} = postResult;
            await fetch(url, {method: 'PUT'});
        }
    }

    async deleteFiles(filePaths: Array<string>): Promise<void> {
        const accessToken: AccessToken = await accessTokenSingleton.getAccessToken();
        if (!accessToken) {
            throw Error('Missing access token');
        }
        await post<{ url: string }>(`/api/admin/post-delete-public-files`, {
            filePaths
        }, accessToken);
    }
}

export const userBucketDataSingleton = new UserBucketDataSingleton();
