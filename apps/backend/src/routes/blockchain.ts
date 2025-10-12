import express, { type Response, type NextFunction, type Router as ExpressRouter } from 'express';
import { randomUUID } from 'node:crypto';
import { Connection, PublicKey } from '@solana/web3.js';
import { authenticate, AuthRequest } from '../middleware/auth';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

const router: ExpressRouter = express.Router();
const connection = new Connection(config.solanaRpcUrl, 'confirmed');

router.use(authenticate);

router.get('/identity', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      return res.json({
        hasIdentity: false,
        message: 'No wallet connected',
      });
    }
    
    // In production, check for identity NFT on Solana
    res.json({
      hasIdentity: true,
      walletAddress,
      network: config.solanaNetwork,
      identityNFT: {
        mint: 'mock-nft-address',
        verified: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/identity/create', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      throw new AppError(400, 'Wallet address required');
    }
    
    // In production, mint identity NFT via Anchor program
    res.json({
      message: 'Identity NFT created',
      mint: `new-nft-address-${randomUUID()}`,
      explorer: `https://explorer.solana.com/address/mock-address?cluster=${config.solanaNetwork}`,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/wallet/balance', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const walletAddress = req.user?.walletAddress;
    
    if (!walletAddress) {
      throw new AppError(400, 'Wallet address required');
    }
    
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      
      res.json({
        walletAddress,
        balance: balance / 1e9, // Convert lamports to SOL
        network: config.solanaNetwork,
      });
    } catch {
      // If wallet is invalid or doesn't exist
      res.json({
        walletAddress,
        balance: 0,
        network: config.solanaNetwork,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/storage/proofs', (_req: AuthRequest, res: Response) => {
  res.json({
    proofs: [
      {
        id: '1',
        fileHash: 'QmX...abc123',
        timestamp: new Date().toISOString(),
        signature: 'verified',
      },
    ],
    count: 1,
  });
});

export default router;
