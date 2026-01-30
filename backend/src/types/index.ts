import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode: number;
  code?: string;
  isOperational?: boolean;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

/**
 * User data attached to authenticated requests
 */
export interface AuthUser {
  userId: string;
  email: string;
  sessionId: string;
}

/**
 * Extended Request type with optional user data for authenticated routes
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
