import {Router, Request, Response} from 'express';
import {getUserBucketParams} from 'infra-common/aws/sysParameters';
import {FileObject} from 'infra-common/system/Bucket';
import {getFilesInDirectory} from 'infra-common/aws/userBucket';
import {verifyAuthentication} from '../../utility/RequestUtils';

const router = Router();

router.get('/get-public-files', async (req: Request, res: Response) => {
    try {
        await verifyAuthentication(req);
    } catch (e: any) {
        res.status(401).send(e.message);
        return;
    }
    try {
        const userBucketParams = await getUserBucketParams();
        const publicFiles: Array<FileObject> = await getFilesInDirectory(userBucketParams, 'public');
        res.status(200).send({publicFiles});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

export default router;
