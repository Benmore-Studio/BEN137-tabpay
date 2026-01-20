import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AsyncHandler } from '../types';

export const asyncHandler = (fn: AsyncHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
