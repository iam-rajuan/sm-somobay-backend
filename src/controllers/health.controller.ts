import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';

export const getHealthStatus = (req: Request, res: Response): void => {
  const mongoStates: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  const healthData = {
    service: 'somity-backend-api',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: mongoStates[dbState] || 'unknown',
      connected: dbState === 1,
    },
    environment: process.env.NODE_ENV || 'development',
    memoryUsageMB: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  };

  sendSuccess(res, 'Somity Management System Backend REST API is running smoothly', healthData);
};

