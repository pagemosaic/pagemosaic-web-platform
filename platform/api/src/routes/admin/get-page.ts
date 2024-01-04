import {Router, Request, Response} from 'express';
import {DI_PageEntry} from 'infra-common/data/DocumentItem';
import {getPageEntriesByKeys} from 'infra-common/dao/documentDao';
import {verifyAuthentication} from '../../utility/RequestUtils';

const router = Router();

router.get('/get-page', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    const pageId = req.query.pageId as string;
    try {
        const foundEntries: Array<DI_PageEntry> = await getPageEntriesByKeys(
                [{S: `PAGE#${pageId}`}],
                ['TAG', 'ENTRY', 'META', 'CONTENT']
            );
        if (foundEntries.length > 0) {
            res.status(200).json({
                pageEntry: foundEntries[0]
            });
        } else {
            res.status(200).send({});
        }
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;
