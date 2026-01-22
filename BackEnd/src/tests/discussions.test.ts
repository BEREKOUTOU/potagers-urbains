import express, { Express, Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { pool } from '../config/database.js';

jest.mock('../config/database.js');

import discussionsRouter from '../routes/discussions.js';

describe('Discussions Routes', () => {
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

    app.use('/api/discussions', discussionsRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/discussions', () => {
    it('should retrieve all discussions', async () => {
      const mockDiscussions = [
        {
          id: 1,
          title: 'Best Tomato Varieties',
          content: 'What tomato varieties work best?',
          created_by_username: 'user1',
          created_at: new Date(),
          reply_count: 5,
          is_pinned: false,
        },
        {
          id: 2,
          title: 'Composting Tips',
          content: 'Tips for effective composting',
          created_by_username: 'user2',
          created_at: new Date(),
          reply_count: 10,
          is_pinned: true,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockDiscussions,
      });

      const res = await request(app)
        .get('/api/discussions');

      expect(res.status).toBe(200);
      expect(res.body.discussions).toHaveLength(2);
      expect(res.body.discussions[0].title).toBe('Best Tomato Varieties');
    });

    it('should filter discussions by garden ID', async () => {
      const mockDiscussions = [
        {
          id: 1,
          title: 'Garden Discussion',
          garden_id: 1,
          created_by_username: 'user1',
          created_at: new Date(),
          reply_count: 3,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockDiscussions,
      });

      const res = await request(app)
        .get('/api/discussions')
        .query({ gardenId: 1 });

      expect(res.status).toBe(200);
      expect(res.body.discussions).toHaveLength(1);
    });

    it('should support pagination', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/discussions')
        .query({ limit: '10', offset: '20' });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/discussions/:id', () => {
    it('should retrieve a discussion by ID with replies', async () => {
      const mockDiscussion = {
        id: 1,
        title: 'Best Tomato Varieties',
        content: 'What tomato varieties work best?',
        created_by_username: 'user1',
        created_at: new Date(),
        reply_count: 5,
      };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockDiscussion] })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              reply_id: 1,
              content: 'Cherry tomatoes are great!',
              created_by_username: 'user2',
              created_at: new Date(),
            },
          ],
        });

      const res = await request(app)
        .get('/api/discussions/1');

      expect(res.status).toBe(200);
      expect(res.body.discussion.title).toBe('Best Tomato Varieties');
    });

    it('should return 404 when discussion not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/discussions/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Discussion not found');
    });
  });

  describe('POST /api/discussions', () => {
    it('should create a new discussion', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            title: 'New Discussion',
            created_by: 1,
          }],
        });

      const res = await request(app)
        .post('/api/discussions')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'New Discussion',
          content: 'Discussion content here',
          gardenId: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.discussion.title).toBe('New Discussion');
    });

    it('should return 401 when not authenticated', async () => {
      app = express();
      app.use(express.json());
      app.use('/api/discussions', discussionsRouter);

      const res = await request(app)
        .post('/api/discussions')
        .send({
          title: 'New Discussion',
          content: 'Content',
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/discussions')
        .set('Authorization', 'Bearer validtoken')
        .send({
          content: 'Missing title',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/discussions/:id/reply', () => {
    it('should add a reply to a discussion', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .post('/api/discussions/1/reply')
        .set('Authorization', 'Bearer validtoken')
        .send({
          content: 'Great discussion topic!',
        });

      expect(res.status).toBe(201);
    });

    it('should return 404 when discussion not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .post('/api/discussions/999/reply')
        .set('Authorization', 'Bearer validtoken')
        .send({
          content: 'Reply content',
        });

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/discussions/:id', () => {
    it('should update a discussion', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ author_id: 1 }],
        })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            title: 'Updated Discussion',
            author_id: 1,
          }],
        });

      const res = await request(app)
        .put('/api/discussions/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'Updated Discussion',
        });

      expect(res.status).toBe(200);
    });

    it('should return 403 when not discussion creator', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, created_by: 999 }],
      });

      const res = await request(app)
        .put('/api/discussions/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'Updated Discussion',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/discussions/:id', () => {
    it('should delete a discussion', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ author_id: 1 }],
      });

      const res = await request(app)
        .delete('/api/discussions/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });
  });
});
