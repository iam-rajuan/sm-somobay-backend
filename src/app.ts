import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rootRouter from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

dotenv.config();

const app: Application = express();

// Security Middlewares
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root Welcome Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    organization: 'এস, এম ক্ষুদ্র সঞ্চয় ও ঋণদান সমবায় সমিতি লিঃ',
    organizationEnglish: 'S.M. Khudra Sanchay O Rindan Samabay Samity Limited',
    shortName: 'S.M. Somobay Somity (এস, এম)',
    registrationNo: 'ট-ক ২৮৪০/২১',
    headOffice: 'Elenga, Kalihati, Tangail, Bangladesh',
    service: 'sm-somobay-backend-api',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Mount V1 API
app.use('/api/v1', rootRouter);

// 404 Catch-All
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;

