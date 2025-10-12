import express, { type Response, type NextFunction, type Router as ExpressRouter } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: ExpressRouter = express.Router();

router.use(authenticate);

interface MediaItem {
  id: string;
  title: string;
  type: 'video' | 'music' | 'photo';
  duration?: number;
  thumbnail?: string;
  addedAt: string;
}

const mediaLibrary: MediaItem[] = [
  {
    id: '1',
    title: 'Family Vacation 2024',
    type: 'video',
    duration: 3600,
    thumbnail: '/thumbnails/vacation.jpg',
    addedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Birthday Party',
    type: 'photo',
    thumbnail: '/thumbnails/birthday.jpg',
    addedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'Favorite Playlist',
    type: 'music',
    duration: 7200,
    addedAt: '2024-03-10T08:00:00Z',
  },
];

router.get('/library', (_req: AuthRequest, res: Response) => {
  res.json({
    media: mediaLibrary,
    count: mediaLibrary.length,
    categories: {
      videos: mediaLibrary.filter(m => m.type === 'video').length,
      photos: mediaLibrary.filter(m => m.type === 'photo').length,
      music: mediaLibrary.filter(m => m.type === 'music').length,
    },
  });
});

router.get('/library/:id', (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = mediaLibrary.find(m => m.id === req.params.id);
    
    if (!item) {
      res.status(404).json({ error: 'Media item not found' });
      return;
    }
    
    res.json({ media: item });
  } catch (error) {
    next(error);
  }
});

router.post('/scan', (_req: AuthRequest, res: Response) => {
  res.json({
    message: 'Media library scan initiated',
    status: 'scanning',
    estimated: '5 minutes',
  });
});

export default router;
