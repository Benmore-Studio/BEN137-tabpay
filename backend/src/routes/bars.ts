import { Router } from 'express';
import { getServiceBarById } from '../controllers/serviceBar.controller';

const router = Router();

router.get('/:id', getServiceBarById);

export default router;
