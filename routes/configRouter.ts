import { Router } from 'express';

const router = Router();

router.post('/generate', async function(req, res) {
    res.status(200).json({ message: '/generate' });
});

export default router;
