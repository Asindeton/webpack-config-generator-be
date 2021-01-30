import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import User from '../models/user';
import mongo from '../storage/mongo';

const router = Router();

const saltRounds = 10;
const jwtSecret = 'webpack generator secret';

router.post(
    '/register',
    [
        check('email', "Email isn't correct").isEmail(),
        check('password', 'Password length min 6 characters').isLength({min: 6}),
        check('name', 'Name is empty').exists()
    ],
    async function(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array(), message: 'Incorrect user data'});
        }
        await mongo.connect();
        const { email, password, name } = req.body;
        const userInDb = await User.findOne({ email });
        if (userInDb) {
          return res.status(400).json({message: 'User has already existed'});
        }
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = new User({ email, password: passwordHash, name });
        await user.save();

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });
        res.status(201).json({ message: 'User was created', token, userId: user.id, name: user.name });
      }
      catch (e) {
        res.status(500).json({ message: 'Something goes wrong', error: e })
      }
});

router.post(
    '/login',
    [
      check('email', "Email isn't correct").normalizeEmail().isEmail(),
      check('password', 'Password is empty').exists()
    ],
    async function(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Incorrect user data'});
            }
            await mongo.connect();
            const { email, password } = req.body;
            const userInDb = await User.findOne({ email });
            if (!userInDb) {
                return res.status(400).json({message: "User doesn't exist"});
            }
            const isMatch = await bcrypt.compare(password, userInDb.password);
            if (!isMatch) {
                return res.status(400).json({message: "Incorrect input user data"});
            }
            const token = jwt.sign({ userId: userInDb.id }, jwtSecret, { expiresIn: '24h' });
            res.status(200).json({ token, userId: userInDb.id, name: userInDb.name });
        }
        catch (e) {
            res.status(500).json({message: 'Something goes wrong'})
        }
    }
);

export default router;
