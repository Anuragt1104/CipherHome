import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// In-memory user store (replace with database in production)
const users: Map<string, { id: string; username: string; passwordHash: string; walletAddress?: string }> = new Map();

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  walletAddress: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, walletAddress } = registerSchema.parse(req.body);
    
    if (users.has(username)) {
      throw new AppError(409, 'Username already exists');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    
    users.set(username, { id, username, passwordHash, walletAddress });
    
    const token = jwt.sign(
      { id, username, walletAddress },
      config.jwtSecret as jwt.Secret,
      { expiresIn: config.jwtExpiry }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id, username, walletAddress },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, error.errors[0].message));
    }
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const user = users.get(username);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials');
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, walletAddress: user.walletAddress },
      config.jwtSecret as jwt.Secret,
      { expiresIn: config.jwtExpiry }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, walletAddress: user.walletAddress },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, error.errors[0].message));
    }
    next(error);
  }
});

export default router;
