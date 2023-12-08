import { resolve } from "node:path";
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import {CacheInvalidationConstruct} from './cache-invalidation';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export interface SystemBucketConstructProps {
    systemBucket: s3.Bucket;
    entryPointDistribution: cloudfront.Distribution;
    previewPointDistribution: cloudfront.Distribution;
}

export class SystemBucketDeploymentConstruct extends Construct {
    constructor(scope: Construct, id: string, props: SystemBucketConstructProps) {
        super(scope, id);

        const adminPwaDeployment = new s3deploy.BucketDeployment(this, 'AdminPwaDeployment', {
            sources: [s3deploy.Source.asset(resolve('../admin-pwa/dist'))],
            destinationBucket: props.systemBucket,
            destinationKeyPrefix: 'admin', // Deploy contents to /admin directory in the bucket
        });

        new s3deploy.BucketDeployment(this, 'WebAppPublicBucketDeployment', {
            sources: [s3deploy.Source.asset(resolve('../web-app/public'))],
            destinationBucket: props.systemBucket,
        });

        new s3deploy.BucketDeployment(this, 'WebAppStaticBucketDeployment', {
            sources: [s3deploy.Source.asset(resolve('../web-app/static'))],
            destinationBucket: props.systemBucket,
            destinationKeyPrefix: 'static', // Deploy contents to /admin directory in the bucket
        });

        // Invalidate the cache for the entry point distribution
        new CacheInvalidationConstruct(this, 'EntryPointDistributionInvalidation', {
            distribution: props.entryPointDistribution,
            paths: ['/admin/*', '/static/*'],
        });
        // // Invalidate the cache for the preview point distribution
        new CacheInvalidationConstruct(this, 'PreviewPointDistributionInvalidation', {
            distribution: props.previewPointDistribution,
            paths: ['/static/*'],
        });
    }
}
