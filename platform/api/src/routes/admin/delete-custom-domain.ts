import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../../utility/RequestUtils';
import {deleteSSLCertificate, getCertificateDetail} from '../../utility/ACMUtils';
import {
    getEntryPointDistributionId,
    getSslCertificateArn,
    delSslCertificateArn, delDomainName
} from '../../utility/SsmUtils';
import {removeCloudFrontDomain} from '../../utility/CloudFrontUtils';

const router = Router();

router.delete('/delete-custom-domain', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    try {
        const distributionId = await getEntryPointDistributionId();
        await removeCloudFrontDomain(distributionId);

        const certificateArn = await getSslCertificateArn();
        await deleteSSLCertificate(certificateArn);

        await delSslCertificateArn();
        await delDomainName();
        res.status(200).send({});
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Deleting of the domain name is failed. ${err.message}`);
    }
});

export default router;
