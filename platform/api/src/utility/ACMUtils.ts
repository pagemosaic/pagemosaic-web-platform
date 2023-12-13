import {
    ACMClient,
    RequestCertificateCommand,
    DescribeCertificateCommand,
    DeleteCertificateCommand
} from '@aws-sdk/client-acm';
import {PlatformWebsiteSslCertificateDetails, getValidDomain} from 'common-utils';

const REGION = 'us-east-1'; // global
let acmClient: ACMClient | undefined = undefined;

function getACMClient(): ACMClient {
    if (!acmClient) {
        acmClient = new ACMClient({region: REGION});
    }
    return acmClient;
}

export async function requestSSLCertificate(domainName: string): Promise<string> {
    const client = getACMClient();

    const validDomain = getValidDomain(domainName);

    // Request a new certificate
    const requestCertificateCommand = new RequestCertificateCommand({
        DomainName: validDomain.rootName,
        ValidationMethod: 'DNS',
        SubjectAlternativeNames: validDomain.alternativeName ? [validDomain.alternativeName] : []
    });

    const requestCertificateResponse = await client.send(requestCertificateCommand);
    return requestCertificateResponse.CertificateArn || '';
}

export async function getCertificateDetail(certificateArn: string): Promise<PlatformWebsiteSslCertificateDetails | undefined> {
    const client = getACMClient();
    const command = new DescribeCertificateCommand({CertificateArn: certificateArn});
    const response = await client.send(command);

    if (response.Certificate) {
        const {DomainValidationOptions, DomainName, Status} = response.Certificate;
        const details: PlatformWebsiteSslCertificateDetails = {
            sslCertificateStatus: Status,
            customDomainName: DomainName
        };
        if (DomainValidationOptions && DomainValidationOptions.length > 0) {
            const {ResourceRecord} = DomainValidationOptions[0];
            if (ResourceRecord && ResourceRecord.Type === 'CNAME') {
                const {Name, Value} = ResourceRecord;
                const nameParts = Name?.split('.') || [];
                if (nameParts.length > 0) {
                    details.validationCName = nameParts[0];
                    details.validationCValue = Value;
                }
            }
        }
        return details;
    } else {
        return undefined;
    }
}

export async function deleteSSLCertificate(certificateArn: string): Promise<void> {
    const client = getACMClient();
    // Delete the SSL certificate
    const deleteCertificateCommand = new DeleteCertificateCommand({ CertificateArn: certificateArn });
    await client.send(deleteCertificateCommand);
}
