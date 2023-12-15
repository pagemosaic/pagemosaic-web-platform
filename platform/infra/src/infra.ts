import * as cdk from 'aws-cdk-lib';
import {
    ACMClient,
    DescribeCertificateCommand,
    CertificateStatus
} from '@aws-sdk/client-acm';
import {
    SSMClient,
    GetParameterCommand
} from "@aws-sdk/client-ssm";
import {
    PARAM_DOMAIN,
    PARAM_SSL_CERTIFICATE_ARN,
    type ValidDomain,
    getValidDomain,
} from 'common-utils';
import {PlatformStack} from './stacks/platform-stack';

const stackName = process.env.STACK_NAME;

if (!stackName) {
    throw Error('Missing STACK_NAME in env');
}

const ssmClient = new SSMClient();
const acmClient = new ACMClient({region: 'us-east-1'});

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

async function getCertificateStatus(certificateArn: string): Promise<CertificateStatus | undefined> {
    try {
        const command = new DescribeCertificateCommand({CertificateArn: certificateArn});
        const response = await acmClient.send(command);
        if (response.Certificate) {
            return response.Certificate.Status;
        }
    } catch (e) {
        ///
    }
    return undefined;
}

async function createStack(stackName: string): Promise<void> {
    let sslCertificateArn: string | undefined = await getSsmParameter(PARAM_SSL_CERTIFICATE_ARN);
    let sslCertificateStatus: CertificateStatus | undefined;
    if (sslCertificateArn) {
        sslCertificateStatus = await getCertificateStatus(sslCertificateArn);
    }
    let domainNames: Array<string> | undefined;
    if (sslCertificateStatus
        && sslCertificateStatus !== 'EXPIRED'
        && sslCertificateStatus !== 'FAILED'
        && sslCertificateStatus !== 'PENDING_VALIDATION'
        && sslCertificateStatus !== 'VALIDATION_TIMED_OUT'
    ) {
        let domainName: string | undefined = await getSsmParameter(PARAM_DOMAIN);
        if (domainName) {
            const validDomain: ValidDomain | undefined = domainName
                ? getValidDomain(domainName)
                : undefined;
            domainNames = validDomain
                ? validDomain.alternativeName
                    ? [validDomain.rootName, validDomain.alternativeName]
                    : [validDomain.rootName]
                : [];
        }
    } else {
        // we can not use certificate when it is not valid
        sslCertificateArn = undefined;
    }
    const app = new cdk.App();
    new PlatformStack(app, stackName, {domainNames, certificateArn: sslCertificateArn});
}

createStack(stackName).catch((e: any) => {
    console.error(e)
});

