import {resolve} from "node:path";
import {Construct} from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigwv2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import {PLATFORM_STACK_NAME} from 'common-utils';

export interface AdminApiConstructProps {
    tables: Array<dynamodb.Table>;
}

export class ApiConstruct extends Construct {
    public readonly httpApi: apigwv2.HttpApi;
    public readonly httpApiGatewayOrigin: origins.HttpOrigin;

    constructor(scope: Construct, id: string, props: AdminApiConstructProps) {
        super(scope, id);
        const {tables} = props;

        const apiDirectoryPath = resolve('../api/dist');
        const lambdaHandler = new lambda.Function(this, 'ApiLambda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(apiDirectoryPath),
            memorySize: 256,
            description: `${PLATFORM_STACK_NAME} API Lambda.`,
            timeout: cdk.Duration.minutes(5),
        });

        // Grant the Lambda function permission to read all SSM parameters
        lambdaHandler.addToRolePolicy(new iam.PolicyStatement({
            actions: ['ssm:GetParameter', 'ssm:GetParameters', 'ssm:GetParametersByPath'],
            resources: [`arn:aws:ssm:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:parameter/*`],
        }));

        if (tables.length > 0) {
            for (const table of tables) {
                // Grant the Lambda function read access to the DynamoDB table
                table.grantReadWriteData(lambdaHandler);
            }
        }

        // Define the HTTP API resource with the Lambda integration
        const lambdaIntegration = new apigwv2Integrations.HttpLambdaIntegration(
            'ApiLambdaIntegration', lambdaHandler
        );

        this.httpApi = new apigwv2.HttpApi(this, 'Api', {
            defaultIntegration: lambdaIntegration,
            description: `${PLATFORM_STACK_NAME} API Endpoint`
        });

        // Define the HTTP Admin API Gateway endpoint as a custom origin
        const region = cdk.Stack.of(this).region;
        this.httpApiGatewayOrigin = new origins.HttpOrigin(`${this.httpApi.apiId}.execute-api.${region}.amazonaws.com`, {
            // Optionally, configure origin properties like custom headers, SSL protocols, etc.
            // If you have a custom domain name for your CloudFront distribution
            // and you want your application to be aware of this custom domain,
            // you should set the X-Forwarded-Host header to this custom domain name.
            // customHeaders: {
            //     'X-Forwarded-Host': hostValue
            // }
        });
    }
}
