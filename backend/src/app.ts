import express from 'express';
import { PrismaClient } from '@prisma/client';
import { corsMiddleware, errorHandler, notFoundHandler } from './middleware';
import apiRoutes from './routes';

export const prisma = new PrismaClient();

export function createApp() {
  const app = express();

  // Middleware
  app.use(corsMiddleware);
  app.use(express.json());

  // Root health check
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        service: 'TabPay Backend',
        version: '1.0.0',
      },
    });
  });

  // Database health check
  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        success: true,
        data: {
          status: 'healthy',
          database: 'connected',
        },
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: error instanceof Error ? error.message : 'Database connection failed',
        },
      });
    }
  });

  // API v1 routes
  app.use('/api/v1', apiRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
