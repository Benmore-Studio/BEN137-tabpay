import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  verifyAge,
  deleteAccount,
} from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/me', getProfile);
router.patch('/me', updateProfile);

// Preferences routes
router.get('/me/preferences', getPreferences);
router.patch('/me/preferences', updatePreferences);

// Age verification
router.post('/me/verify-age', verifyAge);

// Account deletion
router.delete('/me', deleteAccount);

export default router;
