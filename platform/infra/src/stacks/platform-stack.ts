import * as cdk from 'aws-cdk-lib';
import {Stack} from 'aws-cdk-lib/core';
import {Construct} from 'constructs';
import {
    PLATFORM_ENTRY_POINT_DOMAIN_SSM_PARAM,
    PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM,
    PLATFORM_SYS_USER_POOL_ID_SSM_PARAM,
    PLATFORM_SYS_USER_POOL_CLIENT_ID_SSM_PARAM
} from 'common-utils';
import {ApiConstruct} from '../constructs/api';
import {EntryPointConstruct} from '../constructs/entry-point';
import {DbTablesConstruct} from '../constructs/db-tables';
import {WebAppApiConstruct} from '../constructs/web-app-api';
import {SystemBucketConstruct} from '../constructs/system-bucket';
import {PreviewPointConstruct} from '../constructs/preview-point';
import {SystemBucketDeploymentConstruct} from '../constructs/system-bucket-deployment';
import {SysUserPoolConstruct} from '../constructs/sys-user-pool';

export class PlatformStack extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);
        const dbTablesConstruct = new DbTablesConstruct(this, 'DbTablesConstruct');
        const apiConstruct = new ApiConstruct(this, 'ApiConstruct', {
            tables: dbTablesConstruct.tables
        });
        const webAppApiConstruct = new WebAppApiConstruct(this, 'WebAppApiConstruct', {
            tables: dbTablesConstruct.tables
        });

        const systemBucketConstruct = new SystemBucketConstruct(this, 'SystemBucketConstruct');

        const entryPointConstruct = new EntryPointConstruct(this, 'EntryPointConstruct', {
            systemBucket: systemBucketConstruct.bucket,
            systemBucketOAI: systemBucketConstruct.bucketOAI,
            httpApiGatewayOrigin: apiConstruct.httpApiGatewayOrigin,
            webAppHttpApiGatewayOrigin: webAppApiConstruct.httpApiGatewayOrigin
        });

        const previewPointConstruct = new PreviewPointConstruct(this, 'PreviewPointConstruct', {
            systemBucket: systemBucketConstruct.bucket,
            systemBucketOAI: systemBucketConstruct.bucketOAI,
            webAppHttpApiGatewayOrigin: webAppApiConstruct.httpApiGatewayOrigin
        });

        new SystemBucketDeploymentConstruct(this, 'SystemBucketDeploymentConstruct', {
            entryPointDistribution: entryPointConstruct.distribution,
            previewPointDistribution: previewPointConstruct.distribution,
            systemBucket: systemBucketConstruct.bucket
        });

        const sysUserPoolConstruct = new SysUserPoolConstruct(this, 'SysUserPoolConstruct');

        // Output the distribution domain name so it can be easily accessed
        new cdk.CfnOutput(this, PLATFORM_ENTRY_POINT_DOMAIN_SSM_PARAM, {
            value: entryPointConstruct.distribution.distributionDomainName,
        });
        // Output the distribution domain name so it can be easily accessed
        new cdk.CfnOutput(this, PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM, {
            value: previewPointConstruct.distribution.distributionDomainName,
        });
        // Output the sys user pool ID
        new cdk.CfnOutput(this, PLATFORM_SYS_USER_POOL_ID_SSM_PARAM, {
            value: sysUserPoolConstruct.userPool.userPoolId,
        });
        new cdk.CfnOutput(this, PLATFORM_SYS_USER_POOL_CLIENT_ID_SSM_PARAM, {
            value: sysUserPoolConstruct.userPoolClient.userPoolClientId,
        });
    }
}
