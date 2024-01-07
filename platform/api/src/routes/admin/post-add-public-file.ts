import {Router, Request, Response} from 'express';
import {verifyAuthentication} from '../../utility/RequestUtils';
import {getUserBucketParams} from 'infra-common/aws/sysParameters';
import {getUploadUrlForFile} from 'infra-common/aws/userBucket';

const router = Router();

router.post('/post-add-public-file', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    if (!req.body.filePath) {
        res.status(500).send('Missing the file path in the request');
        return;
    }
    try {
        const {filePath} = req.body;
        const userBucketParams = await getUserBucketParams();
        const url = await getUploadUrlForFile(userBucketParams, filePath);
        res.status(200).send({url});
    } catch (err: any) {
        console.error(err);
        res.status(500).send(`Uploading file is failed. ${err.message}`);
    }
});

export default router;
