import { Router } from 'express';
import { changeRole, deleteUser } from '../controllers/users.js';

const router = Router();

router.get('/premium/:uid', changeRole);

router.delete('/:uid', deleteUser);

export default router;
