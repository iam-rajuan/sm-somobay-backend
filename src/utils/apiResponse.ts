import { Response } from 'express';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  error?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  meta?: Record<string, unknown>
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error !== undefined && { error }),
  });
};

