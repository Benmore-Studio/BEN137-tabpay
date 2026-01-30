import { Request, Response } from 'express';
import { prisma } from '../app';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/v1/bars/:id
 * Get service bar details with status
 */
export const getServiceBarById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const serviceBar = await prisma.serviceBar.findUnique({
    where: { id },
    include: {
      venue: {
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
        },
      },
      _count: {
        select: {
          orders: {
            where: {
              status: {
                in: ['received', 'preparing', 'delivering'],
              },
            },
          },
        },
      },
    },
  });

  if (!serviceBar) {
    throw new AppError('Service bar not found', 404, 'SERVICE_BAR_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      id: serviceBar.id,
      name: serviceBar.name,
      location: serviceBar.location,
      activeOrders: serviceBar._count.orders,
      availableServers: serviceBar.availableServers,
      estimatedWaitMinutes: serviceBar.estimatedWaitMinutes,
      status: serviceBar.status,
      isActive: serviceBar.isActive,
      venue: serviceBar.venue,
      createdAt: serviceBar.createdAt,
      updatedAt: serviceBar.updatedAt,
    },
  });
});
