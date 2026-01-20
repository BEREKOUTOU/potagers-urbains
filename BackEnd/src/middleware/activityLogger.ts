import type { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.ts';

type AuthRequest = Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

export async function logActivity(
  userId: number,
  activityType: string,
  description: string,
  entityType?: string,
  entityId?: number
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO activity_log (user_id, activity_type, description, entity_type, entity_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, activityType, description, entityType, entityId]
    );
  } catch (error) {
    console.error('Activity logging error:', error);
  }
}

export function activityLoggerMiddleware(activityType: string, getDescription: (req: AuthRequest) => string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthRequest;
    
    const originalJson = res.json.bind(res) as unknown as (body: unknown) => Response;
    res.json = function(body: unknown) {
      if (authReq.user && res.statusCode >= 200 && res.statusCode < 300) {
        const description = getDescription(authReq);
        logActivity(authReq.user.id, activityType, description).catch(err => {
          console.error('Failed to log activity:', err);
        });
      }
      return originalJson(body);
    };
    
    next();
  };
}
