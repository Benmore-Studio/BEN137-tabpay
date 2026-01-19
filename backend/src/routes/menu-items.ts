import { Router } from 'express';
import { getMenuItemById } from '../controllers/menu.controller';

const router = Router();

router.get('/:id', getMenuItemById);

export default router;
