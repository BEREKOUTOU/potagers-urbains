import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

jest.mock('../config/database.js');

import eventsRouter from '../routes/events.js';

describe('Events Routes', () => {
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

    app.use('/api/events', eventsRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/events', () => {
    it('should retrieve all public events', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Planting Workshop',
          description: 'Learn to plant seeds',
          start_date: new Date(),
          created_by_username: 'user1',
          garden_name: 'Community Garden',
          attendee_count: 10,
          is_public: true,
        },
        {
          id: 2,
          title: 'Harvest Day',
          description: 'Harvest vegetables',
          start_date: new Date(),
          created_by_username: 'user2',
          garden_name: 'Urban Garden',
          attendee_count: 15,
          is_public: true,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockEvents,
      });

      const res = await request(app)
        .get('/api/events');

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(2);
      expect(res.body.events[0].title).toBe('Planting Workshop');
    });

    it('should filter events by garden ID', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Planting Workshop',
          garden_id: 1,
          created_by_username: 'user1',
          garden_name: 'Community Garden',
          attendee_count: 10,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockEvents,
      });

      const res = await request(app)
        .get('/api/events')
        .query({ gardenId: 1 });

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(1);
    });

    it('should filter upcoming events only', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Future Event',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          created_by_username: 'user1',
          garden_name: 'Community Garden',
          attendee_count: 5,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({
        rows: mockEvents,
      });

      const res = await request(app)
        .get('/api/events')
        .query({ upcoming: 'true' });

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(1);
    });

    it('should support pagination', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/events')
        .query({ limit: '10', offset: '20' });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should retrieve an event by ID', async () => {
      const mockEvent = {
        id: 1,
        title: 'Planting Workshop',
        description: 'Learn to plant seeds',
        start_date: new Date(),
        end_date: new Date(),
        location: 'Downtown',
        created_by_username: 'user1',
        garden_name: 'Community Garden',
        attendee_count: 10,
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [mockEvent],
      });

      const res = await request(app)
        .get('/api/events/1');

      expect(res.status).toBe(200);
      expect(res.body.event.title).toBe('Planting Workshop');
    });

    it('should return 404 when event not found', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [],
      });

      const res = await request(app)
        .get('/api/events/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Event not found');
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            title: 'New Event',
            created_by: 1,
          }],
        });

      const res = await request(app)
        .post('/api/events')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'New Event',
          description: 'Event description',
          gardenId: 1,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          location: 'Downtown',
          capacity: 30,
          isPublic: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.event.title).toBe('New Event');
    });

    it('should return 401 when not authenticated', async () => {
      app = express();
      app.use(express.json());
      app.use('/api/events', eventsRouter);

      const res = await request(app)
        .post('/api/events')
        .send({
          title: 'New Event',
          gardenId: 1,
        });

      expect(res.status).toBe(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', 'Bearer validtoken')
        .send({
          description: 'No title provided',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ id: 1, created_by: 1 }],
        })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            title: 'Updated Event',
            created_by: 1,
          }],
        });

      const res = await request(app)
        .put('/api/events/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'Updated Event',
        });

      expect(res.status).toBe(200);
    });

    it('should return 403 when not event creator', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, created_by: 999 }],
      });

      const res = await request(app)
        .put('/api/events/1')
        .set('Authorization', 'Bearer validtoken')
        .send({
          title: 'Updated Event',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ id: 1, created_by: 1 }],
        })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .delete('/api/events/1')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/events/:id/attend', () => {
    it('should add user as event attendee', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [{ id: 1, capacity: 50 }],
        })
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [{ id: 1 }],
        });

      const res = await request(app)
        .post('/api/events/1/attend')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
    });

    it('should return 400 if event is at capacity', async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{
          id: 1,
          capacity: 20,
          attendee_count: 20,
        }],
      });

      const res = await request(app)
        .post('/api/events/1/attend')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(400);
    });
  });
});
