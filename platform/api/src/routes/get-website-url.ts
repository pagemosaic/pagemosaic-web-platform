import {Router, Request, Response} from 'express';
import {PlatformWebsiteUrl} from 'common-utils';
import {verifyAuthentication} from '../utility/RequestUtils';
import {getPlatformWebsiteUrlParams} from '../utility/SsmUtils';

const router = Router();

router.get('/get-website-url', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    try {
        const result: PlatformWebsiteUrl = await getPlatformWebsiteUrlParams();
        res.status(200).json(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;
