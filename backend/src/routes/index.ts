import { Router } from 'express';
import venueRoutes from './venues';
import barRoutes from './bars';
import categoryRoutes from './categories';
import menuItemRoutes from './menu-items';
import authRoutes from './auth';
import userRoutes from './users';

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
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/venues', venueRoutes);
router.use('/bars', barRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu-items', menuItemRoutes);

// Future routes:
// router.use('/orders', orderRoutes);
// router.use('/admin', adminRoutes);

export default router;
