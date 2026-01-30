import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { AppError } from './errorHandler';
import { config } from '../config';
import { AuthenticatedRequest } from '../types';

interface JwtPayload {
  userId: string;
  email: string;
  jti?: string;
  iat?: number;
  exp?: number;
}

/**
 * Required authentication middleware
 * Verifies JWT token and session, attaches user data to request
 * Returns 401 if not authenticated
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, 'NO_TOKEN');
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }

    // Check if session exists in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      throw new AppError('Session not found', 401, 'SESSION_NOT_FOUND');
    }

    // Check if session has expired
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: session.id } });
      throw new AppError('Session has expired', 401, 'SESSION_EXPIRED');
    }

    // Attach user data to request
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      sessionId: session.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware
 * Verifies JWT token if present, but proceeds without error if not
 * Useful for routes that work with or without authentication
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // No token - proceed without user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    // Verify JWT token - if invalid, proceed without user
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch {
      return next();
    }

    // Check if session exists - if not, proceed without user
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session if it exists
      if (session && session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {
          // Ignore errors during cleanup
        });
      }
      return next();
    }

    // Attach user data to request
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      sessionId: session.id,
    };

    next();
  } catch {
    // On any error, proceed without user
    next();
  }
};

/**
 * Cleanup expired sessions
 * Can be called periodically to remove stale sessions from database
 */
export const cleanupExpiredSessions = async (): Promise<number> => {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
};
