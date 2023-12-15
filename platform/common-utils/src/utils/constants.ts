const stackName = process.env.STACK_NAME;

export const PLATFORM_STACK_NAME: string = stackName ? stackName.replace(/\s+/g, '') : 'Undefined';
export const PLATFORM_PAGES_TABLE_NAME: string = `${PLATFORM_STACK_NAME}Pages`;
export const PLATFORM_SYSTEM_TABLE_NAME: string = `${PLATFORM_STACK_NAME}System`;
// System Manager parameters
export const PARAM_ENTRY_POINT_DOMAIN = `/pagemosaic/${PLATFORM_STACK_NAME}/EntryPointDomain`;
export const PARAM_PREVIEW_POINT_DOMAIN = `/pagemosaic/${PLATFORM_STACK_NAME}/PreviewPointDomain`;
export const PARAM_SYS_USER_POOL_ID = `/pagemosaic/${PLATFORM_STACK_NAME}/SysUserPoolId`;
export const PARAM_SYS_USER_POOL_CLIENT_ID = `/pagemosaic/${PLATFORM_STACK_NAME}/SysUserPoolClientId`;
export const PARAM_ENTRY_POINT_DISTRIBUTION_ID = `/pagemosaic/${PLATFORM_STACK_NAME}/EntryPointDistributionId`;
export const PARAM_SSL_CERTIFICATE_ARN = `/pagemosaic/${PLATFORM_STACK_NAME}/SslCertificateArn`;
export const PARAM_DOMAIN = `/pagemosaic/${PLATFORM_STACK_NAME}/Domain`;

// Platform Stack output IDs
export const INFRA_ENTRY_POINT_DOMAIN = 'EntryPointDomain';
export const INFRA_PREVIEW_POINT_DOMAIN = 'PreviewPointDomain';
export const INFRA_SYS_USER_POOL_ID = 'SysUserPoolId';
export const INFRA_SYS_USER_POOL_CLIENT_ID = 'SysUserPoolClientId';
export const INFRA_ENTRY_POINT_DISTRIBUTION_ID = 'EntryPointDistributionId';
