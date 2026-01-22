import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole, type AuthRequest } from '../middleware/auth.js';

jest.mock('jsonwebtoken');

interface MockedResponse extends Response {
  status: jest.Mock;
  json: jest.Mock;
}

describe('Auth Middleware', () => {
  let req: AuthRequest;
  let res: MockedResponse;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    } as unknown as AuthRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as MockedResponse;
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token is provided', () => {
      authenticateToken(req, res, next);

      expect(res.status.mock.calls[0][0]).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header has no token', () => {
      req.headers = { authorization: 'Bearer' };

      authenticateToken(req, res, next);

      expect(res.status.mock.calls[0][0]).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalidtoken';

      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(new Error('Invalid token'));
        }
      );

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should extract user from valid token and call next', () => {
      req.headers.authorization = 'Bearer validtoken';

      const mockUser = {
        id: 1,
        username: 'testuser',
        role: 'user',
      };

      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(null, mockUser);
        }
      );

      authenticateToken(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle Bearer token correctly', () => {
      req.headers.authorization = 'Bearer mytoken123';

      const mockUser = {
        id: 2,
        username: 'admin',
        role: 'admin',
      };

      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(null, mockUser);
        }
      );

      authenticateToken(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should return 401 if user is not authenticated', () => {
      const middleware = requireRole(['admin']);
      // req.user is undefined by default

      middleware(req, res, next);

      expect(res.status.mock.calls[0][0]).toBe(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not authorized', () => {
      const middleware = requireRole(['admin']);
      req.user = {
        id: 1,
        username: 'user',
        role: 'user',
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user role is authorized', () => {
      const middleware = requireRole(['admin', 'moderator']);
      req.user = {
        id: 1,
        username: 'admin',
        role: 'admin',
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow multiple authorized roles', () => {
      const middleware = requireRole(['admin', 'user']);
      req.user = {
        id: 2,
        username: 'testuser',
        role: 'user',
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user role is not in allowed roles list', () => {
      const middleware = requireRole(['admin']);
      req.user = {
        id: 1,
        username: 'guest',
        role: 'guest',
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Complex authorization scenarios', () => {
    it('should validate admin can access admin routes', () => {
      const middleware = requireRole(['admin']);
      req.user = {
        id: 1,
        username: 'admin',
        role: 'admin',
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should prevent user from accessing admin-only routes', () => {
      const middleware = requireRole(['admin']);
      req.user = {
        id: 2,
        username: 'regularuser',
        role: 'user',
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow multiple role types', () => {
      const middleware = requireRole(['admin', 'moderator', 'user']);
      
      const users = [
        { id: 1, username: 'admin', role: 'admin' },
        { id: 2, username: 'mod', role: 'moderator' },
        { id: 3, username: 'user', role: 'user' },
      ];

      users.forEach((user) => {
        req.user = user;
        next.mockClear();
        (res.status as jest.Mock).mockClear();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});

