import { Router } from 'express';
import { getAllCategories } from '../controllers/menu.controller';

const router = Router();

router.get('/', getAllCategories);

export default router;
