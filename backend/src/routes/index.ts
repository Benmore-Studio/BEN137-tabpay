import { Router } from 'express';
import venueRoutes from './venues';
import barRoutes from './bars';

const router = Router();

// Health check for API v1
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      api: 'v1',
    },
  });
});

// API routes
router.use('/venues', venueRoutes);
router.use('/bars', barRoutes);

// Future routes:
// router.use('/auth', authRoutes);
// router.use('/menu', menuRoutes);
// router.use('/orders', orderRoutes);
// router.use('/admin', adminRoutes);

export default router;
