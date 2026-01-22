import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

jest.mock('../config/database.js');
jest.mock('../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = {
      id: 1,
      username: 'testuser',
      role: 'user',
    };
    next();
  }),
}));

import statsRouter from '../routes/stats.js';

describe('Stats Routes', () => {
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

    app.use('/api/stats', statsRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/stats/garden/:gardenId', () => {
    it('should retrieve garden statistics', async () => {
      const mockStats = [
        {
          stat_type: 'yield',
          value: 50,
          unit: 'kg',
          recorded_by_username: 'user1',
          recorded_date: new Date(),
        },
      ];

      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ role: 'member' }] })
        .mockResolvedValueOnce({ rows: mockStats });

      const res = await request(app)
        .get('/api/stats/garden/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
      expect(res.body.stats).toHaveLength(1);
    });

    it('should return 403 if user is not a garden member', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/stats/garden/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/stats/garden/:gardenId', () => {
    it('should add a new statistic', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ role: 'member' }] })
        .mockResolvedValueOnce({
          rows: [{ id: 1, stat_type: 'yield' }],
        });

      const res = await request(app)
        .post('/api/stats/garden/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          statType: 'yield',
          value: 50,
          unit: 'kg',
        });

      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/stats/user', () => {
    it('should retrieve user statistics', async () => {
      const mockStats = [
        {
          stat_name: 'gardens_created',
          value: 3,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockStats,
      });

      const res = await request(app)
        .get('/api/stats/user')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });
  });
});
