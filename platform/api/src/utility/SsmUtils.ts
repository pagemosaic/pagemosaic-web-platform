import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import {
    PLATFORM_SYS_USER_POOL_ID_SSM_PARAM,
    PLATFORM_SYS_USER_POOL_CLIENT_ID_SSM_PARAM,
    PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM
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
    const command = new GetParameterCommand({ Name: parameterName });
    const response = await getSsmClient().send(command);
    if (!response.Parameter?.Value) {
        throw new Error(`Parameter ${parameterName} not found`);
    }
    return response.Parameter.Value;
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
