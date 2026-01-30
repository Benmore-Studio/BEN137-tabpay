import { Response } from 'express';
import { prisma } from '../app';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import {
  updateProfileSchema,
  updatePreferencesSchema,
  verifyAgeSchema,
} from '../utils/validation';
import { AuthenticatedRequest } from '../types';

/**
 * GET /api/v1/users/me
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user!;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
      isAgeVerified: true,
      hasPaymentMethod: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * PATCH /api/v1/users/me
 * Update current user profile
 */
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user!;

  // Validate request body
  const validationResult = updateProfileSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
  }

  const { firstName, lastName, phone, dateOfBirth } = validationResult.data;

  // Check if there's anything to update
  if (!firstName && !lastName && !phone && !dateOfBirth) {
    throw new AppError('No fields to update', 400, 'NO_FIELDS');
  }

  // Build update data
  const updateData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
  } = {};

  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone) updateData.phone = phone;
  if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

  const user = await prisma.user.update({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
      isAgeVerified: true,
      hasPaymentMethod: true,
      createdAt: true,
      updatedAt: true,
    },
    data: updateData,
  });

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * GET /api/v1/users/me/preferences
 * Get user preferences
 */
export const getPreferences = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user!;

  let preferences = await prisma.userPreferences.findUnique({
    where: { userId },
    select: {
      id: true,
      defaultTipPercent: true,
      notifications: true,
      autoReorder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Create default preferences if they don't exist
  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: { userId },
      select: {
        id: true,
        defaultTipPercent: true,
        notifications: true,
        autoReorder: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  res.json({
    success: true,
    data: { preferences },
  });
});

/**
 * PATCH /api/v1/users/me/preferences
 * Update user preferences
 */
export const updatePreferences = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user!;

  // Validate request body
  const validationResult = updatePreferencesSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
  }

  const { defaultTipPercent, notifications, autoReorder } = validationResult.data;

  // Check if there's anything to update
  if (defaultTipPercent === undefined && notifications === undefined && autoReorder === undefined) {
    throw new AppError('No fields to update', 400, 'NO_FIELDS');
  }

  // Build update data
  const updateData: {
    defaultTipPercent?: number;
    notifications?: boolean;
    autoReorder?: boolean;
  } = {};

  if (defaultTipPercent !== undefined) updateData.defaultTipPercent = defaultTipPercent;
  if (notifications !== undefined) updateData.notifications = notifications;
  if (autoReorder !== undefined) updateData.autoReorder = autoReorder;

  // Upsert preferences (create if doesn't exist, update if exists)
  const preferences = await prisma.userPreferences.upsert({
    where: { userId },
    create: {
      userId,
      ...updateData,
    },
    update: updateData,
    select: {
      id: true,
      defaultTipPercent: true,
      notifications: true,
      autoReorder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    data: { preferences },
  });
});

/**
 * POST /api/v1/users/me/verify-age
 * Verify user age (must be 21+)
 */
export const verifyAge = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user!;

  // Validate request body
  const validationResult = verifyAgeSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
  }

  const { dateOfBirth } = validationResult.data;
  const dob = new Date(dateOfBirth);
  const today = new Date();

  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  // Must be at least 21
  const isVerified = age >= 21;

  // Update user
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      dateOfBirth: dob,
      isAgeVerified: isVerified,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      dateOfBirth: true,
      isAgeVerified: true,
      hasPaymentMethod: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!isVerified) {
    res.status(403).json({
      success: false,
      error: {
        code: 'AGE_VERIFICATION_FAILED',
        message: 'You must be at least 21 years old to use this service',
      },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user,
      message: 'Age verified successfully',
    },
  });
});

/**
 * DELETE /api/v1/users/me
 * Delete user account (cascade deletes sessions, preferences, etc.)
 */
export const deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user!;

  // Delete user (cascades to sessions, preferences, saved locations, favorites, etc.)
  await prisma.user.delete({
    where: { id: userId },
  });

  res.json({
    success: true,
    data: {
      message: 'Account deleted successfully',
    },
  });
});
