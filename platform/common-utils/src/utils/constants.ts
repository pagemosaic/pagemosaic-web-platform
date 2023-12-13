const stackName = process.env.STACK_NAME;

export const PLATFORM_STACK_NAME: string = stackName || 'Undefined';
export const PLATFORM_PAGES_TABLE_NAME: string = `${PLATFORM_STACK_NAME}Pages`;
export const PLATFORM_SYSTEM_TABLE_NAME: string = `${PLATFORM_STACK_NAME}System`;
// System Manager parameters
export const PLATFORM_ENTRY_POINT_DOMAIN_SSM_PARAM = `${PLATFORM_STACK_NAME}EntryPointDomain`;
export const PLATFORM_PREVIEW_POINT_DOMAIN_SSM_PARAM = `${PLATFORM_STACK_NAME}PreviewPointDomain`;
export const PLATFORM_SYS_USER_POOL_ID_SSM_PARAM = `${PLATFORM_STACK_NAME}SysUserPoolId`;
export const PLATFORM_SYS_USER_POOL_CLIENT_ID_SSM_PARAM = `${PLATFORM_STACK_NAME}SysUserPoolClientId`;
export const PLATFORM_ENTRY_POINT_DISTRIBUTION_ID_PARAM = `${PLATFORM_STACK_NAME}EntryPointDistributionId`;
export const PLATFORM_SSL_CERTIFICATE_ARN_PARAM = `${PLATFORM_STACK_NAME}SslCertificateArn`;
export const PLATFORM_DOMAIN_PARAM = `${PLATFORM_STACK_NAME}Domain`;
