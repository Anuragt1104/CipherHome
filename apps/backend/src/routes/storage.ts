import express, { type Response, type NextFunction, type Router as ExpressRouter } from 'express';
import { randomUUID } from 'node:crypto';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router: ExpressRouter = express.Router();

// Mock storage data
interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  owner: string;
  encrypted: boolean;
}

const files: Map<string, FileMetadata> = new Map();

router.use(authenticate);

router.get('/files', (req: AuthRequest, res: Response) => {
  const userFiles = Array.from(files.values()).filter(f => f.owner === req.user?.id);
  res.json({ files: userFiles, count: userFiles.length });
});

router.post('/upload', (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, size, mimeType } = req.body;
    
    if (!name || !size || !mimeType) {
      throw new AppError(400, 'Missing required fields: name, size, mimeType');
    }
    
    const fileId = randomUUID();
    const file: FileMetadata = {
      id: fileId,
      name,
      size,
      mimeType,
      uploadedAt: new Date().toISOString(),
      owner: req.user!.id,
      encrypted: true,
    };
    
    files.set(fileId, file);
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file,
      uploadUrl: `/api/storage/files/${fileId}`,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/files/:id', (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = files.get(req.params.id);
    
    if (!file) {
      throw new AppError(404, 'File not found');
    }
    
    if (file.owner !== req.user?.id) {
      throw new AppError(403, 'Access denied');
    }
    
    res.json({ file });
  } catch (error) {
    next(error);
  }
});

router.delete('/files/:id', (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = files.get(req.params.id);
    
    if (!file) {
      throw new AppError(404, 'File not found');
    }
    
    if (file.owner !== req.user?.id) {
      throw new AppError(403, 'Access denied');
    }
    
    files.delete(req.params.id);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
