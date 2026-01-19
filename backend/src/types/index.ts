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
