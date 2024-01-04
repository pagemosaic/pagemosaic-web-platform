import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../../utility/RequestUtils';
import {BasicItem} from 'infra-common/data/BasicItem';
import {createOrUpdateItem} from 'infra-common/aws/database';
import {PLATFORM_DOCUMENTS_TABLE_NAME} from 'infra-common/constants';
import {DI_PageEntry} from 'infra-common/data/DocumentItem';

const router = Router();

router.post('/post-page', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    if (!req.body.page) {
        res.status(500).send('Missing the page entry data in the request');
        return;
    }
    try {
        const page: DI_PageEntry = req.body.page;
        console.log(JSON.stringify(page, null, 4));
        const {Entry, Content, Meta} = page;
        if (Entry && Content && Meta) {
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, Entry);
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, Meta);
            await createOrUpdateItem<BasicItem>(PLATFORM_DOCUMENTS_TABLE_NAME, Content);
        }
        res.status(200).send({});
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Updating page content is failed. ${err.message}`);
    }
});

export default router;
