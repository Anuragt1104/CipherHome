import express, { type Request, type Response, type NextFunction, type Router as ExpressRouter } from 'express';
import { randomUUID } from 'node:crypto';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

const router: ExpressRouter = express.Router();

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
    const id = randomUUID();
    
    users.set(username, { id, username, passwordHash, walletAddress });
    
    const payload = { id, username, walletAddress };
    const secret: Secret = config.jwtSecret;
    const signOptions: SignOptions = { expiresIn: config.jwtExpiry };
    const token = jwt.sign(payload, secret, signOptions);
    
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
    
    const payload = { id: user.id, username: user.username, walletAddress: user.walletAddress };
    const secret: Secret = config.jwtSecret;
    const signOptions: SignOptions = { expiresIn: config.jwtExpiry };
    const token = jwt.sign(payload, secret, signOptions);
    
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
