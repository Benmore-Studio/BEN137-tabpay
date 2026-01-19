import { Router } from 'express';

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

// Future routes will be added here:
// router.use('/auth', authRoutes);
// router.use('/venues', venueRoutes);
// router.use('/menu', menuRoutes);
// router.use('/orders', orderRoutes);
// router.use('/admin', adminRoutes);

export default router;
