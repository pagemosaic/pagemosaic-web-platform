import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../utility/RequestUtils';

const router = Router();

router.post('/post-custom-domain', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    if (!req.body.customDomainName) {
        res.status(500).send('Missing the custom domain name in the request');
        return;
    }
    try {
        const customDomainName = req.body.customDomainName;
        console.log('Custom Domain Name: ', customDomainName);
        // res.status(200).send({});
        res.status(500).send('Some error....');
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Setting a new custom domain name is failed. ${err.message}`);
    }
});

export default router;
