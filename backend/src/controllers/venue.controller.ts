import { Request, Response } from 'express';
import { prisma } from '../app';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

/**
 * GET /api/v1/venues
 * List all active venues
 */
export const getAllVenues = asyncHandler(async (req: Request, res: Response) => {
  const venues = await prisma.venue.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { serviceBars: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const venuesWithCount = venues.map((venue) => ({
    id: venue.id,
    name: venue.name,
    address: venue.address,
    description: venue.description,
    imageUrl: venue.imageUrl,
    isActive: venue.isActive,
    timezone: venue.timezone,
    serviceBarsCount: venue._count.serviceBars,
    createdAt: venue.createdAt,
    updatedAt: venue.updatedAt,
  }));

  res.json({
    success: true,
    data: venuesWithCount,
  });
});

/**
 * GET /api/v1/venues/:id
 * Get venue details by ID
 */
export const getVenueById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      _count: {
        select: { serviceBars: true },
      },
    },
  });

  if (!venue) {
    throw new AppError('Venue not found', 404, 'VENUE_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      id: venue.id,
      name: venue.name,
      address: venue.address,
      description: venue.description,
      imageUrl: venue.imageUrl,
      isActive: venue.isActive,
      timezone: venue.timezone,
      serviceBarsCount: venue._count.serviceBars,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
    },
  });
});

/**
 * GET /api/v1/venues/:id/bars
 * List service bars for a venue
 */
export const getVenueServiceBars = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // First check if venue exists
  const venue = await prisma.venue.findUnique({
    where: { id },
  });

  if (!venue) {
    throw new AppError('Venue not found', 404, 'VENUE_NOT_FOUND');
  }

  const serviceBars = await prisma.serviceBar.findMany({
    where: {
      venueId: id,
      isActive: true,
    },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const barsWithStatus = serviceBars.map((bar) => ({
    id: bar.id,
    name: bar.name,
    location: bar.location,
    activeOrders: bar._count.orders,
    availableServers: bar.availableServers,
    estimatedWaitMinutes: bar.estimatedWaitMinutes,
    status: bar.status,
    isActive: bar.isActive,
    venueId: bar.venueId,
    createdAt: bar.createdAt,
    updatedAt: bar.updatedAt,
  }));

  res.json({
    success: true,
    data: barsWithStatus,
  });
});
