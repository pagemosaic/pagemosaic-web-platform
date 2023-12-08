import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../utility/RequestUtils';
import {BasicItem, PLATFORM_PAGES_TABLE_NAME} from 'common-utils';
import {createOrUpdateItem} from '../utility/DynamoDbUtils';

const router = Router();

router.post('/post-page-content', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    if (!req.body.page) {
        res.status(500).send('Missing the page data in the request');
        return;
    }
    try {
        const page: BasicItem = req.body.page;
        await createOrUpdateItem<BasicItem>(PLATFORM_PAGES_TABLE_NAME, page);
        res.status(200).send({});
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Updating page content is failed. ${err.message}`);
    }
});

export default router;
