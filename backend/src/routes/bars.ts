import { Router } from 'express';
import { getServiceBarById } from '../controllers/serviceBar.controller';
import {
  getServiceBarMenu,
  getServiceBarMenuByCategory,
} from '../controllers/menu.controller';

const router = Router();

router.get('/:barId/menu', getServiceBarMenu);
router.get('/:barId/menu/:categoryId', getServiceBarMenuByCategory);
router.get('/:id', getServiceBarById);

export default router;
