import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

jest.mock('../config/database.js');

import resourcesRouter from '../routes/resources.js';

describe('Resources Routes', () => {
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

    app.use('/api/resources', resourcesRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/resources', () => {
    it('should retrieve published resources', async () => {
      const mockResources = [
        {
          id: 1,
          title: 'Organic Gardening Guide',
          description: 'Learn organic gardening',
          resource_type: 'guide',
          author_username: 'expert1',
          is_published: true,
          guide_count: 3,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockResources,
      });

      const res = await request(app)
        .get('/api/resources');

      expect(res.status).toBe(200);
      expect(res.body.resources).toHaveLength(1);
    });

    it('should filter resources by type', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/resources')
        .query({ resourceType: 'guide' });

      expect(res.status).toBe(200);
    });

    it('should filter resources by author', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/resources')
        .query({ authorId: 1 });

      expect(res.status).toBe(200);
    });

    it('should search resources by title or description', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/resources')
        .query({ search: 'gardening' });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/resources/:id', () => {
    it('should retrieve a resource by ID', async () => {
      const mockResource = {
        id: 1,
        title: 'Organic Gardening Guide',
        description: 'Learn organic gardening',
        author_username: 'expert1',
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [mockResource],
      });

      const res = await request(app)
        .get('/api/resources/1');

      expect(res.status).toBe(200);
      expect(res.body.resource.title).toBe('Organic Gardening Guide');
    });

    it('should return 404 when resource not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/resources/999');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/resources', () => {
    it('should create a new resource', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            title: 'New Guide',
            author_id: 1,
          }],
        });

      const res = await request(app)
        .post('/api/resources')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'New Guide',
          description: 'Description',
          resourceType: 'guide',
          content: 'Content here',
        });

      expect(res.status).toBe(201);
    });

    it('should return 401 when not authenticated', async () => {
      app = express();
      app.use(express.json());
      app.use('/api/resources', resourcesRouter);

      const res = await request(app)
        .post('/api/resources')
        .send({
          title: 'New Guide',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/resources/:id', () => {
    it('should update a resource', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ id: 1, author_id: 1 }],
        })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            title: 'Updated Guide',
          }],
        });

      const res = await request(app)
        .put('/api/resources/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'Updated Guide',
        });

      expect(res.status).toBe(200);
    });

    it('should return 403 when not resource author', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, author_id: 999 }],
      });

      const res = await request(app)
        .put('/api/resources/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'Updated Guide',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/resources/:id', () => {
    it('should delete a resource', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ id: 1, author_id: 1 }],
        })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .delete('/api/resources/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });
  });
});
