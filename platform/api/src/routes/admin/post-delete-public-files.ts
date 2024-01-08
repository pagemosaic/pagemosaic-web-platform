import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../../utility/RequestUtils';
import {getUserBucketParams} from 'infra-common/aws/sysParameters';
import {deleteFiles} from 'infra-common/aws/userBucket';

const router = Router();

router.post('/post-delete-public-files', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    if (!req.body.filePaths) {
        res.status(500).send('Missing the file paths in the request');
        return;
    }
    try {
        const {filePaths} = req.body;
        const userBucketParams = await getUserBucketParams();
        await deleteFiles(userBucketParams, filePaths);
        res.status(200).send({});
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Deleting files is failed. ${err.message}`);
    }
});

export default router;
