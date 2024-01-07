import {
    S3Client,
    ListObjectsV2Command,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {FileObject, UserBucketParams} from '../system/Bucket';

const AWS_REGION: string | undefined = process.env.AWS_REGION;

let s3Client: S3Client | undefined = undefined;

export function getS3Client(): S3Client {
    if (!s3Client) {
        s3Client = new S3Client({region: AWS_REGION});
    }
    return s3Client;
}

export async function getFilesInDirectory(userBucketParams: UserBucketParams, dirName: string): Promise<Array<FileObject>> {
    const {entryPointDomain, bucketName} = userBucketParams;
    const client = getS3Client();
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: dirName,
        // The default and maximum number of keys returned is 1000. This limits it to
        // one for demonstration purposes.
        //MaxKeys: 1000,
    });
    let isTruncated: boolean = true;
    const files: Array<FileObject> = [];
    while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
        if (Contents) {
            for (const contentItem of Contents) {
                const {Key, Size, LastModified} = contentItem;
                if (Key) {
                    files.push({
                        id: Key,
                        url: `https://${entryPointDomain}/${Key}`,
                        size: Size,
                        timestamp: LastModified?.getTime()
                    });
                }
            }
        }
        isTruncated = !!IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
    }
    return files;
}

export async function getUploadUrlForFile(userBucketParams: UserBucketParams, fileKey: string): Promise<string> {
    const client = getS3Client();
    const command = new PutObjectCommand({
        Bucket: userBucketParams.bucketName,
        Key: fileKey
    });

    return getSignedUrl(client, command, { expiresIn: 3600 });
}
