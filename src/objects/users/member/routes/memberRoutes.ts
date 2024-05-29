import express from 'express';
import signup from '../controllers/signUp';
import signin from '../controllers/signIn';

const router = express.Router();

router.post('/createMember',signup);

router.post('/login', signin);

export default router;