import * as cdk from 'aws-cdk-lib';
import {Stack} from 'aws-cdk-lib/core';
import {Construct} from 'constructs';
import {ApiConstruct} from './constructs/api';
import {EntryPointConstruct} from './constructs/entry-point';
import {DbTablesConstruct} from './constructs/db-tables';
import {WebAppApiConstruct} from './constructs/web-app-api';
import {SystemBucketConstruct} from './constructs/system-bucket';
import {PreviewPointConstruct} from './constructs/preview-point';
import {SystemBucketDeploymentConstruct} from './constructs/system-bucket-deployment';
import {SysUserPoolConstruct} from './constructs/sys-user-pool';
import {
    INFRA_SYS_USER_POOL_ID,
    INFRA_ENTRY_POINT_DOMAIN,
    INFRA_PREVIEW_POINT_DOMAIN,
    INFRA_SYS_USER_POOL_CLIENT_ID,
    INFRA_ENTRY_POINT_DISTRIBUTION_ID, INFRA_USER_BUCKET_NAME
} from '../common/constants';
import {UserBucketConstruct} from './constructs/user-bucket';

interface PlatformProps {
    domainNames?: Array<string>;
    certificateArn?: string;
}

export class Platform extends Stack {
    constructor(scope: Construct, id: string, props: PlatformProps) {
        super(scope, id);
        const {domainNames, certificateArn} = props;

        const systemBucketConstruct = new SystemBucketConstruct(this, 'SystemBucketConstruct');
        const userBucketConstruct = new UserBucketConstruct(this, 'UserBucketConstruct');

        const sysUserPoolConstruct = new SysUserPoolConstruct(this, 'SysUserPoolConstruct');
        const dbTablesConstruct = new DbTablesConstruct(this, 'DbTablesConstruct');
        const apiConstruct = new ApiConstruct(this, 'ApiConstruct', {
            userBucket: userBucketConstruct.bucket,
            tables: dbTablesConstruct.tables,
            sysUserPoolId: sysUserPoolConstruct.userPool.userPoolId
        });
        const webAppApiConstruct = new WebAppApiConstruct(this, 'WebAppApiConstruct', {
            tables: dbTablesConstruct.tables
        });


        const entryPointConstruct = new EntryPointConstruct(this, 'EntryPointConstruct', {
            systemBucket: systemBucketConstruct.bucket,
            systemBucketOAI: systemBucketConstruct.bucketOAI,
            userBucket: userBucketConstruct.bucket,
            userBucketOAI: userBucketConstruct.bucketOAI,
            httpApiGatewayOrigin: apiConstruct.httpApiGatewayOrigin,
            webAppHttpApiGatewayOrigin: webAppApiConstruct.httpApiGatewayOrigin,
            domainNames,
            certificateArn
        });

        const previewPointConstruct = new PreviewPointConstruct(this, 'PreviewPointConstruct', {
            systemBucket: systemBucketConstruct.bucket,
            systemBucketOAI: systemBucketConstruct.bucketOAI,
            userBucket: userBucketConstruct.bucket,
            userBucketOAI: userBucketConstruct.bucketOAI,
            webAppHttpApiGatewayOrigin: webAppApiConstruct.httpApiGatewayOrigin
        });

        new SystemBucketDeploymentConstruct(this, 'SystemBucketDeploymentConstruct', {
            entryPointDistribution: entryPointConstruct.distribution,
            previewPointDistribution: previewPointConstruct.distribution,
            systemBucket: systemBucketConstruct.bucket
        });

        // Output the distribution domain name so it can be easily accessed
        new cdk.CfnOutput(this, INFRA_ENTRY_POINT_DOMAIN, {
            value: entryPointConstruct.distribution.distributionDomainName,
        });
        // Output the distribution domain name so it can be easily accessed
        new cdk.CfnOutput(this, INFRA_PREVIEW_POINT_DOMAIN, {
            value: previewPointConstruct.distribution.distributionDomainName,
        });
        // Output the sys user pool ID
        new cdk.CfnOutput(this, INFRA_SYS_USER_POOL_ID, {
            value: sysUserPoolConstruct.userPool.userPoolId,
        });
        new cdk.CfnOutput(this, INFRA_SYS_USER_POOL_CLIENT_ID, {
            value: sysUserPoolConstruct.userPoolClient.userPoolClientId,
        });
        new cdk.CfnOutput(this, INFRA_ENTRY_POINT_DISTRIBUTION_ID, {
            value: entryPointConstruct.distribution.distributionId,
        });
        new cdk.CfnOutput(this, INFRA_USER_BUCKET_NAME, {
            value: userBucketConstruct.bucket.bucketName
        });
    }
}
