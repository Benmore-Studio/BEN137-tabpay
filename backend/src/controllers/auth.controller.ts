import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { registerSchema, loginSchema, refreshSchema } from '../utils/validation';
import { config } from '../config';

/**
 * POST /api/v1/auth/register
 * Register a new user with email/password
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
  }

  const { email, password, firstName, lastName, phone } = validationResult.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError(
      'Email already registered',
      409,
      'EMAIL_EXISTS'
    );
  }

  // Hash password with bcrypt (cost factor 12)
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user and default preferences in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });

    // Create default user preferences
    await tx.userPreferences.create({
      data: {
        userId: newUser.id,
      },
    });

    return newUser;
  });

  // Generate JWT token with unique jti to prevent collisions
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      jti: `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );

  // Create session in database
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // Return user data (without password) and token
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAgeVerified: user.isAgeVerified,
        hasPaymentMethod: user.hasPaymentMethod,
        createdAt: user.createdAt,
      },
      token,
      expiresAt: expiresAt.toISOString(),
    },
  });
});

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
  }

  const { email, password } = validationResult.data;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Generic error message for security (don't reveal if email exists)
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Generate JWT token with unique jti to prevent collisions
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      jti: `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );

  // Create session in database (allow multiple sessions per user)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // Return user data (without password) and token
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAgeVerified: user.isAgeVerified,
        hasPaymentMethod: user.hasPaymentMethod,
        createdAt: user.createdAt,
      },
      token,
      expiresAt: expiresAt.toISOString(),
    },
  });
});

/**
 * POST /api/v1/auth/logout
 * Logout and invalidate session
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401, 'NO_TOKEN');
  }

  const token = authHeader.substring(7);

  // Delete session from database
  await prisma.session.deleteMany({
    where: { token },
  });

  res.json({
    success: true,
    data: {
      message: 'Logged out successfully',
    },
  });
});

/**
 * POST /api/v1/auth/refresh
 * Refresh JWT token
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = refreshSchema.safeParse(req.body);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors);
  }

  const { token: oldToken } = validationResult.data;

  // Verify old token
  let decoded;
  try {
    decoded = jwt.verify(oldToken, config.jwt.secret) as {
      userId: string;
      email: string;
    };
  } catch (error) {
    throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }

  // Check if session exists in database
  const session = await prisma.session.findUnique({
    where: { token: oldToken },
    include: { user: true },
  });

  if (!session) {
    throw new AppError('Session not found', 401, 'SESSION_NOT_FOUND');
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new AppError('Session expired', 401, 'SESSION_EXPIRED');
  }

  // Generate new JWT token with unique jti to prevent collisions
  const newToken = jwt.sign(
    {
      userId: decoded.userId,
      email: decoded.email,
      jti: `${decoded.userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );

  // Update session with new token
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.session.update({
    where: { id: session.id },
    data: {
      token: newToken,
      expiresAt: newExpiresAt,
    },
  });

  // Return new token and user data
  res.json({
    success: true,
    data: {
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        phone: session.user.phone,
        isAgeVerified: session.user.isAgeVerified,
        hasPaymentMethod: session.user.hasPaymentMethod,
        createdAt: session.user.createdAt,
      },
      token: newToken,
      expiresAt: newExpiresAt.toISOString(),
    },
  });
});
