const stackName = process.env.STACK_NAME;

export const PLATFORM_STACK_NAME: string = stackName ? stackName.replace(/\s+/g, '') : 'Undefined';
export const PLATFORM_DOCUMENTS_TABLE_NAME: string = `${PLATFORM_STACK_NAME}Documents`;
export const PLATFORM_ENTRIES_BY_TYPE_INDEX_NAME: string = 'EntriesByType';
export const PLATFORM_ENTRIES_BY_TAG_ID_INDEX_NAME: string = 'EntriesByTagId';
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

// Database document item constants
export const DI_MAIN_PAGE_ENTRY_TYPE = 'main_page';
export const DI_REGULAR_PAGE_ENTRY_TYPE = 'page';
export const DI_TAG_ENTRY_TYPE = 'tag';

export const DI_ENTRY_SLICE_KEY = 'ENTRY';
export const DI_CONTENT_SLICE_KEY = 'CONTENT';
export const DI_META_SLICE_KEY = 'META';
export const DI_TAG_SLICE_KEY = 'TAG';
export const DI_DESCRIPTION_SLICE_KEY = 'DESCRIPTION';

export const DI_PAGE_ENTRY_SLICE_KEYS = [
    DI_ENTRY_SLICE_KEY,
    DI_CONTENT_SLICE_KEY,
    DI_META_SLICE_KEY,
    DI_TAG_SLICE_KEY
] as const;

export const DI_TAG_ENTRY_SLICE_KEYS = [
    DI_ENTRY_SLICE_KEY,
    DI_DESCRIPTION_SLICE_KEY
] as const;
