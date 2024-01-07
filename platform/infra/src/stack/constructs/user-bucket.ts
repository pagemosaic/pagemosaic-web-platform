import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export interface UserBucketConstructProps {
}

export class UserBucketConstruct extends Construct {
    public readonly bucket: s3.Bucket;
    public readonly bucketOAI: cloudfront.OriginAccessIdentity;
    constructor(scope: Construct, id: string, props?: UserBucketConstructProps) {
        super(scope, id);
        // Create an S3 bucket where the user's files will be stored
        this.bucket = new s3.Bucket(this, 'UserBucket', {
            publicReadAccess: false, // It's recommended to keep this false as CloudFront will be used to serve the content
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
            cors: [
                {
                    allowedMethods: [
                        s3.HttpMethods.GET,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.DELETE
                    ],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                },
            ],
        });

        // Define the OAI for CloudFront to access the S3 bucket
        this.bucketOAI = new cloudfront.OriginAccessIdentity(this, 'UserBucketOAI');
        this.bucket.grantRead(this.bucketOAI);
    }
}