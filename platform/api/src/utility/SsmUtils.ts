import {
    SSMClient,
    GetParameterCommand,
    PutParameterCommand,
    PutParameterCommandInput,
    DeleteParameterCommand
} from "@aws-sdk/client-ssm";
import {
    PLATFORM_SYS_USER_POOL_ID_SSM_PARAM,
    PLATFORM_SYS_USER_POOL_CLIENT_ID_SSM_PARAM,
    PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM,
    PLATFORM_ENTRY_POINT_DISTRIBUTION_ID_PARAM,
    PLATFORM_ENTRY_POINT_DOMAIN_SSM_PARAM,
    PlatformWebsiteUrlParams,
    PLATFORM_SSL_CERTIFICATE_ARN_PARAM, PLATFORM_DOMAIN_PARAM
} from 'common-utils';

export type CognitoUserPoolConfig = {
    UserPoolId: string;
    ClientId: string;
};

let ssmClient: undefined | SSMClient = undefined;
let sysUserPoolConfig: undefined | CognitoUserPoolConfig = undefined;

function getSsmClient(): SSMClient {
    if (!ssmClient) {
        ssmClient = new SSMClient();
    }
    return ssmClient;
}

async function getSsmParameter(parameterName: string): Promise<string> {
    try {
        const command = new GetParameterCommand({Name: parameterName});
        const response = await getSsmClient().send(command);
        return response.Parameter?.Value || '';
    } catch (e) {
        ////
    }
    return '';
}

async function putSsmParameter(parameterName: string, parameterValue: string) {
    const params: PutParameterCommandInput = {
        Name: parameterName,
        Type: 'String',
        Value: parameterValue,
        Overwrite: true
    };

    try {
        const command = new PutParameterCommand(params);
        await getSsmClient().send(command);
    } catch (err) {
        console.error(`Error storing parameter ${parameterName}:`, err);
    }
}

export async function delSsmParameter(parameterName: string) {
    const params = {
        Name: parameterName
    };
    try {
        const command = new DeleteParameterCommand(params);
        await getSsmClient().send(command);
    } catch (err) {
        console.error(`Error deleting parameter ${parameterName}:`, err);
    }
}

export async function setSslCertificateArn(certificateArn: string): Promise<void> {
    await putSsmParameter(PLATFORM_SSL_CERTIFICATE_ARN_PARAM, certificateArn);
}

export async function delSslCertificateArn(): Promise<void> {
    await delSsmParameter(PLATFORM_SSL_CERTIFICATE_ARN_PARAM);
}

export async function setDomainName(domainName: string): Promise<void> {
    await putSsmParameter(PLATFORM_DOMAIN_PARAM, domainName);
}

export async function delDomainName(): Promise<void> {
    await delSsmParameter(PLATFORM_DOMAIN_PARAM);
}

export async function getSysUserPoolConfig(): Promise<CognitoUserPoolConfig> {
    if (!sysUserPoolConfig) {
        sysUserPoolConfig = {
            UserPoolId: await getSsmParameter(PLATFORM_SYS_USER_POOL_ID_SSM_PARAM),
            ClientId: await getSsmParameter(PLATFORM_SYS_USER_POOL_CLIENT_ID_SSM_PARAM)
        };
    }
    return sysUserPoolConfig;
}

export async function getPreviewPointDomain(): Promise<string> {
    return getSsmParameter(PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM);
}

export async function getEntryPointDistributionId(): Promise<string> {
    return getSsmParameter(PLATFORM_ENTRY_POINT_DISTRIBUTION_ID_PARAM);
}

export async function getSslCertificateArn(): Promise<string> {
    return getSsmParameter(PLATFORM_SSL_CERTIFICATE_ARN_PARAM);
}

export async function getPlatformWebsiteUrlParams(): Promise<PlatformWebsiteUrlParams> {
    return {
        entryPointDistributionId: await getSsmParameter(PLATFORM_ENTRY_POINT_DISTRIBUTION_ID_PARAM),
        previewPointDomain: await getSsmParameter(PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM),
        entryPointDomain: await getSsmParameter(PLATFORM_ENTRY_POINT_DOMAIN_SSM_PARAM),
        sslCertificateArn: await getSsmParameter(PLATFORM_SSL_CERTIFICATE_ARN_PARAM),
        domain: await getSsmParameter(PLATFORM_DOMAIN_PARAM)
    };
}



