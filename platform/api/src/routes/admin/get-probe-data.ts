import {Router, Request, Response} from 'express';

const router = Router();

router.get('/get-probe-data', async (req: Request, res: Response) => {
    res.status(200).json({
        name: 'Probe Data'
    });
});

export default router;
