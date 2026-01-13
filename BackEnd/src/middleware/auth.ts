import express from 'express';
import jwt from 'jsonwebtoken';

export type AuthRequest = express.Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

export const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: jwt.VerifyErrors | null, user: jwt.JwtPayload | string | undefined) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = user as { id: number; username: string; role: string };
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: express.Response, next: express.NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};



