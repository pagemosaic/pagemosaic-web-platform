import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export interface EntryPointConstructProps {
    httpApiGatewayOrigin: origins.HttpOrigin;
    webAppHttpApiGatewayOrigin: origins.HttpOrigin;
    systemBucket: s3.Bucket;
    systemBucketOAI: cloudfront.OriginAccessIdentity;
}

const certificateArn = process.env.CERTIFICATE_ARN;
const domainNames = process.env.DOMAIN_NAMES ? process.env.DOMAIN_NAMES.split(',') : [];

export class EntryPointConstruct extends Construct {
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props: EntryPointConstructProps) {
        super(scope, id);

        // Create a cache policy for the WebApp HttpApi
        const webAppApiCachePolicy = new cloudfront.CachePolicy(this, 'WebAppApiApiCachePolicy', {
            minTtl: cdk.Duration.seconds(600),
            defaultTtl: cdk.Duration.seconds(600),
            maxTtl: cdk.Duration.seconds(600),
            cachePolicyName: 'WebAppApiApiCachePolicy',
            comment: 'Cache policy for WebApp HttpApi with 10 minutes TTL',
        });

        const adminRewriteFunction = new cloudfront.Function(this, 'AdminRewriteFunction', {
            code: cloudfront.FunctionCode.fromInline(`
                function handler(event) {
                    var request = event.request;
                    var uri = request.uri;
        
                    // Check if the URI is for a file (has a file extension)
                    if (!uri.match(/\\/[^\\/]*\\.[^\\/]*$/)) {
                        // Not a file, rewrite to /admin/index.html
                        request.uri = '/admin/index.html';
                    }
                    return request;
                }
            `),
        });

        // Create the CloudFront distribution
        this.distribution = new cloudfront.Distribution(this, 'EntryPointDistribution', {
            domainNames: domainNames.length > 0 ? domainNames : undefined,
            certificate: certificateArn
                ? acm.Certificate.fromCertificateArn(this, 'CustomCertificate', certificateArn)
                : undefined,
            defaultBehavior: {
                origin: props.webAppHttpApiGatewayOrigin,
                originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: webAppApiCachePolicy,
            },
            additionalBehaviors: {
                '/api/*': {
                    origin: props.httpApiGatewayOrigin,
                    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED
                },
                '/admin': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    functionAssociations: [{
                        function: adminRewriteFunction,
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                    }],
                },
                '/admin/*': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    functionAssociations: [{
                        function: adminRewriteFunction,
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                    }],
                },
                '/static/*': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
                '/favicon.ico': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
                '/favicon.svg': {
                    origin: new origins.S3Origin(props.systemBucket, {
                        originAccessIdentity: props.systemBucketOAI
                    }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
            }
        });
    }
}
