import express from 'express';
import { add, get, remove, update } from '../controllers/testRedis';

const router = express.Router();

router.post('/:keyName', add);

router.put('/:keyName', update);

router.get('/:keyName', get);

router.delete('/:keyName', remove);

export default router;
