import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

// Mock the database
jest.mock('../config/database.js');

// Mock authenticateToken
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

// Import router after mocking
import gardensRouter from '../routes/gardens.js';

describe('Gardens Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock authenticateToken middleware
    app.use((req: Request & { user?: { id: number; username: string; role: string } }, res: Response, next: NextFunction) => {
      req.user = {
        id: 1,
        username: 'testuser',
        role: 'user',
      };
      next();
    });

    app.use('/api/gardens', gardensRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/gardens', () => {
    it('should retrieve all gardens with default pagination', async () => {
      const mockGardens = [
        {
          id: 1,
          name: 'Community Garden 1',
          location: 'Downtown',
          region: 'North',
          description: 'Beautiful community garden',
          created_by_username: 'user1',
          current_members: 5,
          created_at: new Date(),
        },
        {
          id: 2,
          name: 'Urban Garden 2',
          location: 'Uptown',
          region: 'South',
          description: 'Urban gardening space',
          created_by_username: 'user2',
          current_members: 8,
          created_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockGardens,
      });

      const res = await request(app)
        .get('/api/gardens');

      expect(res.status).toBe(200);
      expect(res.body.gardens).toHaveLength(2);
      expect(res.body.gardens[0].name).toBe('Community Garden 1');
    });

    it('should filter gardens by region', async () => {
      const mockGardens = [
        {
          id: 1,
          name: 'Community Garden 1',
          region: 'North',
          created_by_username: 'user1',
          current_members: 5,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockGardens,
      });

      const res = await request(app)
        .get('/api/gardens')
        .query({ region: 'North' });

      expect(res.status).toBe(200);
      expect(res.body.gardens).toHaveLength(1);
      expect(res.body.gardens[0].region).toBe('North');
    });

    it('should search gardens by name or description', async () => {
      const mockGardens = [
        {
          id: 1,
          name: 'Community Garden',
          description: 'A nice place for tomatoes',
          created_by_username: 'user1',
          current_members: 5,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockGardens,
      });

      const res = await request(app)
        .get('/api/gardens')
        .query({ search: 'tomato' });

      expect(res.status).toBe(200);
      expect(res.body.gardens).toHaveLength(1);
    });

    it('should support pagination with limit and offset', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/gardens')
        .query({ limit: '10', offset: '20' });

      expect(res.status).toBe(200);
    });

    it('should return 500 on database error', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const res = await request(app)
        .get('/api/gardens');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  });

  describe('GET /api/gardens/:id', () => {
    it('should retrieve a garden by ID', async () => {
      const mockGarden = {
        id: 1,
        name: 'Community Garden',
        location: 'Downtown',
        region: 'North',
        description: 'Beautiful garden',
        created_by_username: 'user1',
        current_members: 5,
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [mockGarden],
      });

      const res = await request(app)
        .get('/api/gardens/1');

      expect(res.status).toBe(200);
      expect(res.body.garden.name).toBe('Community Garden');
      expect(res.body.garden.location).toBe('Downtown');
    });

    it('should return 404 when garden not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/gardens/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Garden not found');
    });
  });

  describe('POST /api/gardens', () => {
    it('should create a new garden', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'New Garden',
            location: 'Downtown',
            region: 'North',
            description: 'New community garden',
            max_members: 20,
            crops: ['tomatoes', 'lettuce'],
            features: ['shade', 'water'],
            image_url: 'https://example.com/image.jpg',
            created_by: 1,
          }],
        })
        .mockResolvedValueOnce({ rows: [] }); // Add creator as coordinator

      const res = await request(app)
        .post('/api/gardens')
        .set('Authorization', 'Bearer validtoken')
        .send({
          name: 'New Garden',
          location: 'Downtown',
          region: 'North',
          description: 'New community garden',
          maxMembers: 20,
          crops: ['tomatoes', 'lettuce'],
          features: ['shade', 'water'],
          imageUrl: 'https://example.com/image.jpg',
        });

      expect(res.status).toBe(201);
      expect(res.body.garden.name).toBe('New Garden');
    });

    it('should return 401 when not authenticated', async () => {
      // Temporarily change the authenticateToken mock to return 401
      const { authenticateToken } = await import('../middleware/auth.js');
      const originalImpl = (authenticateToken as jest.Mock).getMockImplementation();
      (authenticateToken as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(401).json({ error: 'Access token required' });
      });

      const unauthApp = express();
      unauthApp.use(express.json());
      unauthApp.use('/api/gardens', gardensRouter);

      const res = await request(unauthApp)
        .post('/api/gardens')
        .send({
          name: 'New Garden',
          location: 'Downtown',
          region: 'North',
        });

      expect(res.status).toBe(401);

      // Restore original implementation
      (authenticateToken as jest.Mock).mockImplementation(originalImpl);
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/gardens')
        .set('Authorization', 'Bearer validtoken')
        .send({
          location: 'Downtown',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/gardens/:id', () => {
    it('should update a garden', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            created_by: 1,
          }],
        })
        .mockResolvedValueOnce({
          rows: [{
            role: 'coordinator',
          }],
        })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'Updated Garden',
            location: 'Downtown',
            region: 'North',
            description: 'Updated description',
            created_by: 1,
          }],
        });

      const res = await request(app)
        .put('/api/gardens/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          name: 'Updated Garden',
          description: 'Updated description',
        });

      expect(res.status).toBe(200);
      expect(res.body.garden).toBeDefined();
      expect(res.body.garden.name).toBe('Updated Garden');
    });

    it('should return 403 when not garden creator or admin', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{
          role: 'member', // Not coordinator or admin
        }],
      });

      const res = await request(app)
        .put('/api/gardens/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          name: 'Updated Garden',
        });

      expect(res.status).toBe(403);
    });

    it('should return 404 when garden not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .put('/api/gardens/999')
        .set('Authorization', 'Bearer validtoken')
        .send({
          name: 'Updated Garden',
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/gardens/:id', () => {
    it('should delete a garden', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{
            role: 'coordinator',
          }],
        })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .delete('/api/gardens/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });

    it('should return 403 when not garden creator', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{
          id: 1,
          created_by: 999,
        }],
      });

      const res = await request(app)
        .delete('/api/gardens/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/gardens/:id/join', () => {
    it('should allow user to join a garden', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            current_members: 5,
            max_members: 20,
          }],
        })
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .post('/api/gardens/1/join')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });

    it('should return 400 when garden is full', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            max_members: 20,
          }],
        })
        .mockResolvedValueOnce({
          rows: [{ count: '20' }],
        });

      const res = await request(app)
        .post('/api/gardens/1/join')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(400);
    });
  });
});
