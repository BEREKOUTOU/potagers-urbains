import express from 'express';
import { z } from 'zod';

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

// Auth validation schemas
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    location: z.string().optional(),
    region: z.string().optional(),
    bio: z.string().max(500).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    region: z.string().max(100).optional(),
    profilePictureUrl: z.string().url().optional(),
    phone: z.string().max(20).optional(),
  }),
});

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        return res.status(400).json({
          error: 'Validation failed',
          details: zodError.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
