export type UserBucketParams = {
    bucketName: string;
    entryPointDomain: string;
};

export type FileObject = {
    id: string;
    url: string;
    size?: number;
    timestamp?: number;
};

export interface TreeNode {
    isRoot?: boolean;
    name: string;
    path: string;
    children: Array<TreeNode>;
    fileObject?: FileObject;
    parent?: TreeNode;
}
