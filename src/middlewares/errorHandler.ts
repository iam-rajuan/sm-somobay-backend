import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation Error', 400, formattedErrors);
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 'Resource not found: invalid identifier', 404);
    return;
  }

  // Handle JWT Error
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token: authorization denied', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token has expired: please log in again', 401);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 Unhandled Error:', err);
  }

  sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};

