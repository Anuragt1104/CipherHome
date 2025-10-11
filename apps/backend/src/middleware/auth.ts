import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    walletAddress?: string;
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret as jwt.Secret) as any;
    
    req.user = {
      id: decoded.id,
      username: decoded.username,
      walletAddress: decoded.walletAddress,
    };
    
    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token'));
  }
};
