import {Router, Request, Response} from 'express';
import {DI_PageEntry, DI_EntrySlice} from 'infra-common/data/DocumentItem';
import {getEntrySliceByEntryType, getPageEntriesByKeys} from 'infra-common/dao/documentDao';
import {verifyAuthentication} from '../../utility/RequestUtils';

const router = Router();

router.get('/get-all-page-templates', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    try {
        const result: {
            pageTemplateEntries: Array<DI_PageEntry>;
        } = {
            pageTemplateEntries: [],
        };
        let foundEntries: Array<DI_EntrySlice> = await getEntrySliceByEntryType({S: 'page_template'});

        if (foundEntries.length > 0) {
            result.pageTemplateEntries = await getPageEntriesByKeys(
                foundEntries.map(i => i.PK),
                ['ENTRY', 'META']
            );
        }
        res.status(200).json(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;
