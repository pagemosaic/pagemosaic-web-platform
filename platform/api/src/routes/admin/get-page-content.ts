import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../../utility/RequestUtils';
import {BasicItem} from 'infra-common/data/BasicItem';
import {getItemByKey} from 'infra-common/aws/database';
import {PLATFORM_DOCUMENTS_TABLE_NAME} from 'infra-common/constants';

const router = Router();

router.get('/get-page-content', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    const {pk, sk} = req.query;
    if (!pk) {
        res.status(500).send('Missing the pk parameter');
        return;
    }
    if (!sk) {
        res.status(500).send('Missing the sk parameter');
        return;
    }
    try {
        const page: BasicItem | undefined = await getItemByKey<BasicItem>(
            PLATFORM_DOCUMENTS_TABLE_NAME, {
                PK: {S: pk as string},
                SK: {S: sk as string}
            }
        );
        res.status(200).json(page || {});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;
