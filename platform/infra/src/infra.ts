import * as cdk from 'aws-cdk-lib';
import {
    SSMClient,
    GetParameterCommand
} from "@aws-sdk/client-ssm";
import {
    PLATFORM_DOMAIN_PARAM,
    PLATFORM_SSL_CERTIFICATE_ARN_PARAM,
    type ValidDomain,
    getValidDomain
} from 'common-utils';
import { PlatformStack } from './stacks/platform-stack';

const stackName = process.env.STACK_NAME;

if (!stackName) {
    throw Error ('Missing STACK_NAME in env');
}

const ssmClient = new SSMClient();

async function getSsmParameter(parameterName: string): Promise<string | undefined> {
    try {
        const command = new GetParameterCommand({Name: parameterName});
        const response = await ssmClient.send(command);
        return response.Parameter?.Value;
    } catch (e) {
        ///
    }
    return undefined;
}

let domainName: string | undefined;
let sslCertificateArn: string | undefined;
getSsmParameter(PLATFORM_DOMAIN_PARAM)
    .then((param: string | undefined) => {
        domainName = param;
        return getSsmParameter(PLATFORM_SSL_CERTIFICATE_ARN_PARAM);
    })
    .then((param: string | undefined) => {
        sslCertificateArn = param;

        const validDomain: ValidDomain | undefined = domainName
            ? getValidDomain(domainName)
            : undefined;
        const domainNames = validDomain
            ? validDomain.alternativeName
                ? [validDomain.rootName, validDomain.alternativeName]
                : [validDomain.rootName]
            : [];

        const app = new cdk.App();
        new PlatformStack(app, stackName, {domainNames, certificateArn: sslCertificateArn});
    })
    .catch((e: any) => {console.error(e)});

