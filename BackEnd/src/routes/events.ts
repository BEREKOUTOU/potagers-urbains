import express from 'express';
import { pool } from '../config/database.ts';
import { authenticateToken } from '../middleware/auth.ts';

type AuthRequest = express.Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

const router = express.Router();

// Get all events
router.get('/', async (req, res): Promise<void> => {
  try {
    const { gardenId, upcoming, limit = '20', offset = '0' } = req.query;

    let query = `
      SELECT e.*, u.username as created_by_username, g.name as garden_name,
             COUNT(ea.user_id) as attendee_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN gardens g ON e.garden_id = g.id
      LEFT JOIN event_attendees ea ON e.id = ea.event_id AND ea.rsvp_status = 'attending'
    `;
    const values: (string | number)[] = [];
    let paramCount = 1;

    if (gardenId) {
      query += ` WHERE e.garden_id = $${paramCount++}`;
      values.push(gardenId as string);
    } else {
      query += ` WHERE e.is_public = true`;
    }

    if (upcoming === 'true') {
      query += ` AND e.start_date > CURRENT_TIMESTAMP`;
    }

    query += ` GROUP BY e.id, u.username, g.name ORDER BY e.start_date ASC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, values);

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT e.*, u.username as created_by_username, g.name as garden_name,
              COUNT(ea.user_id) as attendee_count
       FROM events e
       LEFT JOIN users u ON e.created_by = u.id
       LEFT JOIN gardens g ON e.garden_id = g.id
       LEFT JOIN event_attendees ea ON e.id = ea.event_id AND ea.rsvp_status = 'attending'
       WHERE e.id = $1
       GROUP BY e.id, u.username, g.name`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ event: result.rows[0] });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new event
router.post('/', authenticateToken, async (req, res): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { title, description, startDate, endDate, location, gardenId, maxAttendees, eventType, isPublic } = req.body;

    // If gardenId is provided, check if user is a member of that garden
    if (gardenId) {
      const membershipCheck = await pool.query(
        'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
        [userId, gardenId]
      );

      if (membershipCheck.rows.length === 0) {
        res.status(403).json({ error: 'You must be a member of the garden to create events' });
        return;
      }
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, start_date, end_date, location, garden_id, created_by, max_attendees, event_type, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, description, startDate, endDate, location, gardenId, userId, maxAttendees, eventType, isPublic]
    );

    const event = result.rows[0];

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update event
router.put('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { title, description, startDate, endDate, location, maxAttendees, eventType, isPublic } = req.body;

    // Check if user created the event or is admin
    const eventCheck = await pool.query(
      'SELECT created_by FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (eventCheck.rows[0].created_by !== userId && (req as AuthRequest).user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `UPDATE events
       SET title = $1, description = $2, start_date = $3, end_date = $4, location = $5,
           max_attendees = $6, event_type = $7, is_public = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, description, startDate, endDate, location, maxAttendees, eventType, isPublic, id]
    );

    res.json({
      message: 'Event updated successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete event
router.delete('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user created the event or is admin
    const eventCheck = await pool.query(
      'SELECT created_by FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (eventCheck.rows[0].created_by !== userId && (req as AuthRequest).user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await pool.query('DELETE FROM events WHERE id = $1', [id]);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// RSVP to event
router.post('/:id/rsvp', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { rsvpStatus } = req.body;

    // Check if event exists
    const eventCheck = await pool.query(
      'SELECT id, max_attendees FROM events WHERE id = $1',
      [id]
    );

    if (eventCheck.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Check attendee count if trying to attend
    if (rsvpStatus === 'attending') {
      const attendeeCount = await pool.query(
        'SELECT COUNT(*) as count FROM event_attendees WHERE event_id = $1 AND rsvp_status = $2',
        [id, 'attending']
      );

      if (parseInt(attendeeCount.rows[0].count) >= eventCheck.rows[0].max_attendees) {
        res.status(400).json({ error: 'Event is full' });
        return;
      }
    }

    // Insert or update RSVP
    await pool.query(
      `INSERT INTO event_attendees (event_id, user_id, rsvp_status)
       VALUES ($1, $2, $3)
       ON CONFLICT (event_id, user_id)
       DO UPDATE SET rsvp_status = $3, rsvp_date = CURRENT_TIMESTAMP`,
      [id, userId, rsvpStatus]
    );

    res.json({ message: 'RSVP updated successfully' });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get event attendees
router.get('/:id/attendees', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.profile_picture_url,
              ea.rsvp_status, ea.rsvp_date
       FROM users u
       JOIN event_attendees ea ON u.id = ea.user_id
       WHERE ea.event_id = $1
       ORDER BY ea.rsvp_date ASC`,
      [id]
    );

    res.json({ attendees: result.rows });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;



