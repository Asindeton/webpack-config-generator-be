import { Router } from 'express';
import generator from '../webpack-config-generator/generator';
import mongo from '../storage/mongo';
import { ObjectId } from "mongodb";
import User from '../models/user';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

const router = Router();

router.post('/generate', async function(req, res) {
    const checkedQuestions = req.body;
    if (!checkedQuestions) {
        res.status(400).json({ message: 'Empty params' });
        return;
    }

    const webpackConfig = generator(checkedQuestions);

    const userId = parseJwt(req, res, false);
    if (userId) {
        await mongo.connect();
        const userInDb = await User.findById(new ObjectId(userId));
        if (userInDb) {
            userInDb.webpackConfig = webpackConfig.webpackConfig;
            userInDb.npmRun = webpackConfig.npmRunCommands;
            userInDb.npmDRun = webpackConfig.npmRunDCommands;
            await userInDb.save();
        }
    }
    res.status(200).json({ webpackConfig: webpackConfig.webpackConfig, npmRun: webpackConfig.npmRunCommands, npmDRun: webpackConfig.npmRunDCommands });
});

router.get('/last', async function(req, res) {
    const userId = parseJwt(req, res, true);
    if (!userId) {
        return res.status(401).json({ message: 'No authorization', messageCode: 'noAuthorization' });
    }

    await mongo.connect();
    const userInDb = await User.findById(new ObjectId(userId));
    if (!userInDb) {
        return res.status(400).json({message: "User doesn't exist", messageCode: 'incorrectUserData'});
    }

    res.status(200).json({ webpackConfig: userInDb.webpackConfig, npmRun: userInDb.npmRun, npmDRun: userInDb.npmDRun });
});

function parseJwt(req, res, isStrictAuth) {
    try {
        const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
        if (isStrictAuth && !token) {
            return res.status(401).json({ message: 'No authorization', messageCode: 'noAuthorization' });
        }
        const user = jwt.verify(token, config.get('jwtSecret'));
        return user ? user.userId : undefined;
    } catch (e) {
        if (isStrictAuth) {
            return res.status(401).json({ message: 'No authorization', messageCode: 'noAuthorization' });
        }
    }
}

export default router;
