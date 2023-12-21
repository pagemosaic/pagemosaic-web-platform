import {Router, Request, Response} from 'express';
import {DI_PageEntry, DI_EntrySlice} from 'infra-common/data/DocumentItem';
import {getEntrySliceByEntryType, getPageEntriesByKeys} from 'infra-common/dao/documentDao';
import {verifyAuthentication} from '../../utility/RequestUtils';

const router = Router();

router.get('/get-all-pages', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    const {entryType, tagId} = req.query;
    try {
        const result: {
            pagesEntries: Array<DI_PageEntry>;
        } = {
            pagesEntries: [],
        };
        let foundEntries: Array<DI_EntrySlice> = [];
        if (!entryType) {
            foundEntries = foundEntries.concat(await getEntrySliceByEntryType({S: 'main_page'}));
            foundEntries = foundEntries.concat(await getEntrySliceByEntryType({S: 'page'}));
        } else {
            foundEntries = foundEntries.concat(await getEntrySliceByEntryType({S: entryType as string}));
        }

        if (foundEntries.length > 0) {
            result.pagesEntries = await getPageEntriesByKeys(
                foundEntries.map(i => i.PK),
                ['TAG', 'ENTRY', 'META']
            );
        }

        res.status(200).json(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;
