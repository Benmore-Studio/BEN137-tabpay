import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { ApiError } from '../types';

export class AppError extends Error implements ApiError {
  statusCode: number;
  code: string;
  isOperational: boolean;
  details?: unknown;

  constructor(message: string, statusCode: number, code?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'ERROR';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(error);
};

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  // Log error in development
  if (config.env === 'development') {
    console.error('Error:', {
      message,
      statusCode,
      code,
      stack: err.stack,
    });
  }

  const errorResponse: {
    success: false;
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
  } = {
    success: false,
    error: {
      code,
      message:
        config.env === 'production' && statusCode === 500 ? 'Internal Server Error' : message,
    },
  };

  // Add details if available (e.g., validation errors)
  if (err.details) {
    errorResponse.error.details = err.details;
  }

  res.status(statusCode).json(errorResponse);
};
