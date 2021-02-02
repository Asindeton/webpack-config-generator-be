import { Router } from 'express';
import generator from '../webpack-config-generator/generator';

const router = Router();

router.post('/generate', async function(req, res) {
    const checkedQuestions = req.body;
    if (!checkedQuestions) {
        res.status(400).json({ message: 'Empty params' });
        return;
    }

    const config = generator(checkedQuestions);
    res.status(200).json({ webpackConfig: config.webpackConfig, npmRun: config.npmRunCommands, npmDRun: config.npmRunDCommands });
});

export default router;
