import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export interface PreviewPointConstructProps {
    webAppHttpApiGatewayOrigin: origins.HttpOrigin;
    systemBucket: s3.Bucket;
    systemBucketOAI: cloudfront.OriginAccessIdentity;
}

export class PreviewPointConstruct extends Construct {
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props: PreviewPointConstructProps) {
        super(scope, id);

        // Create the CloudFront distribution
        this.distribution = new cloudfront.Distribution(this, 'PreviewPointDistribution', {
            defaultBehavior: {
                origin: props.webAppHttpApiGatewayOrigin,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            },
            additionalBehaviors: {
                '/static/*': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
                },
                '/favicon.ico': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
                },
                '/favicon.svg': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
                },
            }
        });
    }
}
