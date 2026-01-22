import express, { Express, Request, Response, NextFunction } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

jest.mock('../config/database.js');
jest.mock('jsonwebtoken');

import usersRouter from '../routes/users.js';

describe('Users Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', usersRouter);

    // Mock jwt.verify to simulate authenticated users
    (jwt.verify as jest.Mock).mockImplementation(
      (token: string, secret: string, callback: (err: Error | null, user?: any) => void) => {
        if (token === 'validtoken' || token === 'admintoken') {
          callback(null, {
            id: 1,
            username: token === 'admintoken' ? 'admin' : 'testuser',
            role: token === 'admintoken' ? 'admin' : 'user',
          });
        } else {
          callback(new Error('Invalid token'));
        }
      }
    );

    // Mock pool.connect to return a client with transaction support
    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all users', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [
          { id: 1, username: 'user1', email: 'user1@test.com', role: 'user' },
          { id: 2, username: 'user2', email: 'user2@test.com', role: 'user' },
        ],
      });

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer admintoken');
      expect(res.status).toBe(200);
      expect(res.body.users).toHaveLength(2);
    });

    it('should handle database errors', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer admintoken');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /:id', () => {
    it('should return a user by ID', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, username: 'testuser', email: 'test@test.com', role: 'user' }],
      });

      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', 'Bearer validtoken');
      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(1);
    });

    it('should return 404 when user not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', 'Bearer validtoken');
      expect(res.status).toBe(404);
    });

    it('should return 403 when accessing another user without admin role', async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
      const res = await request(app)
        .get('/api/users/999')
        .set('Authorization', 'Bearer validtoken');
      expect(res.status).toBe(403);
    });
  });

  describe('PUT /:id', () => {
    it('should update a user', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, first_name: 'Updated', last_name: 'User', bio: 'Test bio' }],
      });

      const res = await request(app)
        .put('/api/users/1')
        .set('Authorization', 'Bearer validtoken')
        .send({ firstName: 'Updated', lastName: 'User', bio: 'Test bio' });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User updated successfully');
    });

    it('should return 403 when user is not authorized to update other user', async () => {
      const res = await request(app)
        .put('/api/users/999')
        .set('Authorization', 'Bearer validtoken')
        .send({ firstName: 'Updated' });
      
      expect(res.status).toBe(403);
    });

    it('should return 400 when no fields to update', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .set('Authorization', 'Bearer validtoken')
        .send({});
      
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /', () => {
    it('should delete the authenticated user account', async () => {
      const mockClient = {
        query: jest
          .fn()
          .mockResolvedValueOnce(undefined) // BEGIN
          .mockResolvedValueOnce({ rowCount: 1 }) // DELETE favorites
          .mockResolvedValueOnce({ rowCount: 1 }) // DELETE user_gardens
          .mockResolvedValueOnce({ rowCount: 1 }) // DELETE user_preferences
          .mockResolvedValueOnce({ rowCount: 1 }) // DELETE activity_log
          .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // DELETE users
          .mockResolvedValueOnce(undefined), // COMMIT
        release: jest.fn(),
      };
      (pool.connect as jest.Mock).mockResolvedValue(mockClient);

      const res = await request(app)
        .delete('/api/users')
        .set('Authorization', 'Bearer validtoken');
      expect(res.status).toBe(200);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});

