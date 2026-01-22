import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

jest.mock('../config/database.js');
jest.mock('../config/multer.js', () => ({
  upload: {
    single: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next()),
  },
  validateFileContent: jest.fn((req: Request, res: Response, next: NextFunction) => next()),
  scanFileAntivirus: jest.fn((req: Request, res: Response, next: NextFunction) => next()),
}));

import photosRouter from '../routes/photos.js';

describe('Photos Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.use((req: Request & { user?: { id: number; username: string; role: string } }, res: Response, next: NextFunction) => {
      req.user = {
        id: 1,
        username: 'testuser',
        role: 'user',
      };
      next();
    });

    app.use('/api/photos', photosRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/photos', () => {
    it('should retrieve public photos', async () => {
      const mockPhotos = [
        {
          id: 1,
          title: 'Garden photo 1',
          url: 'https://example.com/photo1.jpg',
          uploader_username: 'user1',
          garden_name: 'Community Garden',
          is_public: true,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockPhotos,
      });

      const res = await request(app)
        .get('/api/photos');

      expect(res.status).toBe(200);
      expect(res.body.photos).toHaveLength(1);
    });

    it('should filter photos by garden', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/photos')
        .query({ gardenId: 1 });

      expect(res.status).toBe(200);
    });

    it('should support pagination', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/photos')
        .query({ limit: '10', offset: '20' });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/photos/:id', () => {
    it('should retrieve a photo by ID', async () => {
      const mockPhoto = {
        id: 1,
        title: 'Garden photo',
        url: 'https://example.com/photo.jpg',
        uploader_username: 'user1',
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [mockPhoto],
      });

      const res = await request(app)
        .get('/api/photos/1');

      expect(res.status).toBe(200);
      expect(res.body.photo.title).toBe('Garden photo');
    });

    it('should return 404 when photo not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/photos/999');

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/photos/:id', () => {
    it('should delete a photo', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ id: 1, uploaded_by: 1 }],
        })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .delete('/api/photos/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });
  });
});
