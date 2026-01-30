import { Router } from 'express';
import {
  getAllVenues,
  getVenueById,
  getVenueServiceBars,
} from '../controllers/venue.controller';

const router = Router();

router.get('/', getAllVenues);
router.get('/:id', getVenueById);
router.get('/:id/bars', getVenueServiceBars);

export default router;
