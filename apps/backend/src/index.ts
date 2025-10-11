import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import storageRoutes from './routes/storage';
import aiRoutes from './routes/ai';
import mediaRoutes from './routes/media';
import blockchainRoutes from './routes/blockchain';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'CipherHome API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/blockchain', blockchainRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 CipherHome API running on port ${PORT}`);
  console.log(`🔐 Environment: ${config.nodeEnv}`);
});

export default app;
