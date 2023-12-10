export type PlatformWebsiteUrlParams = {
    previewPointDomain: string;
    entryPointDomain: string;
    entryPointDistributionId: string;
    sslCertificateArn?: string;
};

export type PlatformWebsiteUrl = PlatformWebsiteUrlParams & {
    customDomainName?: string;
};
