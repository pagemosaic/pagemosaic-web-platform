import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export interface SystemBucketConstructProps {
}

export class SystemBucketConstruct extends Construct {
    public readonly bucket: s3.Bucket;
    public readonly bucketOAI: cloudfront.OriginAccessIdentity;
    constructor(scope: Construct, id: string, props?: SystemBucketConstructProps) {
        super(scope, id);
        // Create an S3 bucket where the PWA will be stored
        this.bucket = new s3.Bucket(this, 'SystemBucket', {
            publicReadAccess: false, // It's recommended to keep this false as CloudFront will be used to serve the content
            removalPolicy: cdk.RemovalPolicy.DESTROY, // BE CAREFUL with this in production
            autoDeleteObjects: true, // BE CAREFUL with this in production
        });

        // Define the OAI for CloudFront to access the S3 bucket
        this.bucketOAI = new cloudfront.OriginAccessIdentity(this, 'SystemBucketOAI');
        this.bucket.grantRead(this.bucketOAI);
    }
}
