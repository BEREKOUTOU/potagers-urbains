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

// Get stats for a garden
router.get('/garden/:gardenId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { gardenId } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user is a member of the garden
    const membershipCheck = await pool.query(
      'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
      [userId, gardenId]
    );

    if (membershipCheck.rows.length === 0 && (req as AuthRequest).user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `SELECT stat_type, value, unit, recorded_date, u.username as recorded_by_username
       FROM stats s
       LEFT JOIN users u ON s.recorded_by = u.id
       WHERE s.garden_id = $1
       ORDER BY s.recorded_date DESC`,
      [gardenId]
    );

    res.json({ stats: result.rows });
  } catch (error) {
    console.error('Get garden stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new stat
router.post('/garden/:gardenId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { gardenId } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { statType, value, unit } = req.body;

    // Check if user is a member of the garden
    const membershipCheck = await pool.query(
      'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
      [userId, gardenId]
    );

    if (membershipCheck.rows.length === 0) {
      res.status(403).json({ error: 'You must be a member of the garden to add stats' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO stats (garden_id, stat_type, value, unit, recorded_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [gardenId, statType, value, unit, userId]
    );

    const stat = result.rows[0];

    res.status(201).json({
      message: 'Stat added successfully',
      stat
    });
  } catch (error) {
    console.error('Add stat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update stat
router.put('/:statId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { statId } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { value, unit } = req.body;

    // Check if user recorded the stat or is admin
    const statCheck = await pool.query(
      'SELECT recorded_by FROM stats WHERE id = $1',
      [statId]
    );

    if (statCheck.rows.length === 0) {
      res.status(404).json({ error: 'Stat not found' });
      return;
    }

    const isRecorder = statCheck.rows[0].recorded_by === userId;
    const isAdmin = (req as AuthRequest).user!.role === 'admin';

    if (!isRecorder && !isAdmin) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `UPDATE stats
       SET value = $1, unit = $2
       WHERE id = $3
       RETURNING *`,
      [value, unit, statId]
    );

    res.json({
      message: 'Stat updated successfully',
      stat: result.rows[0]
    });
  } catch (error) {
    console.error('Update stat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete stat
router.delete('/:statId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { statId } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user recorded the stat or is admin
    const statCheck = await pool.query(
      'SELECT recorded_by FROM stats WHERE id = $1',
      [statId]
    );

    if (statCheck.rows.length === 0) {
      res.status(404).json({ error: 'Stat not found' });
      return;
    }

    const isRecorder = statCheck.rows[0].recorded_by === userId;
    const isAdmin = (req as AuthRequest).user!.role === 'admin';

    if (!isRecorder && !isAdmin) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await pool.query('DELETE FROM stats WHERE id = $1', [statId]);

    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Delete stat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get aggregated stats for dashboard
router.get('/dashboard/:gardenId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { gardenId } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user is a member of the garden
    const membershipCheck = await pool.query(
      'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
      [userId, gardenId]
    );

    if (membershipCheck.rows.length === 0 && (req as AuthRequest).user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Get latest stats for each type
    const latestStats = await pool.query(
      `SELECT DISTINCT ON (stat_type) stat_type, value, unit, recorded_date
       FROM stats
       WHERE garden_id = $1
       ORDER BY stat_type, recorded_date DESC`,
      [gardenId]
    );

    // Get stat trends (last 30 days)
    const trends = await pool.query(
      `SELECT stat_type, value, recorded_date
       FROM stats
       WHERE garden_id = $1 AND recorded_date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY stat_type, recorded_date DESC`,
      [gardenId]
    );

    res.json({
      latestStats: latestStats.rows,
      trends: trends.rows
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;



