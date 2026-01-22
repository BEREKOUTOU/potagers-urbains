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

// Get all gardens
router.get('/', async (req, res) => {
  try {
    const { region, search, limit = '20', offset = '0' } = req.query;

    let query = `
      SELECT g.*, u.username as created_by_username,
             COUNT(ug.user_id) as current_members
      FROM gardens g
      LEFT JOIN users u ON g.created_by = u.id
      LEFT JOIN user_gardens ug ON g.id = ug.garden_id AND ug.is_active = true
      WHERE g.is_active = true
    `;
    const values: (string | number)[] = [];
    let paramCount = 1;

    if (region) {
      query += ` AND g.region = $${paramCount++}`;
      values.push(region as string);
    }

    if (search) {
      query += ` AND (g.name ILIKE $${paramCount} OR g.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` GROUP BY g.id, u.username ORDER BY g.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, values);

    res.json({ gardens: result.rows });
    return;
  } catch (error) {
    console.error('Get gardens error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Get garden by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT g.*, u.username as created_by_username,
              COUNT(ug.user_id) as current_members
       FROM gardens g
       LEFT JOIN users u ON g.created_by = u.id
       LEFT JOIN user_gardens ug ON g.id = ug.garden_id AND ug.is_active = true
       WHERE g.id = $1 AND g.is_active = true
       GROUP BY g.id, u.username`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Garden not found' });
      return;
    }

    res.json({ garden: result.rows[0] });
    return;
  } catch (error) {
    console.error('Get garden error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Create new garden
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }
    const userId = user.id;
    const { name, location, region, description, maxMembers, crops, features, imageUrl } = req.body;

    // Validate required fields
    if (!name || !location || !region) {
      res.status(400).json({ error: 'Missing required fields: name, location, region' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO gardens (name, location, region, description, max_members, crops, features, image_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, location, region, description, maxMembers, crops, features, imageUrl, userId]
    );

    const garden = result.rows[0];

    if (!garden || !garden.id) {
      res.status(500).json({ error: 'Failed to create garden' });
      return;
    }

    // Add creator as coordinator
    await pool.query(
      'INSERT INTO user_gardens (user_id, garden_id, role) VALUES ($1, $2, $3)',
      [userId, garden.id, 'coordinator']
    );

    res.status(201).json({
      message: 'Garden created successfully',
      garden
    });
    return;
  } catch (error) {
    console.error('Create garden error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Update garden
router.put('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = user.id;
    const { name, location, region, description, maxMembers, crops, features, imageUrl, isActive } = req.body;

    // First check if garden exists
    const gardenCheck = await pool.query(
      'SELECT id FROM gardens WHERE id = $1 AND is_active = true',
      [id]
    );

    if (gardenCheck.rows.length === 0) {
      res.status(404).json({ error: 'Garden not found' });
      return;
    }

    // Check if user is coordinator or admin of the garden
    const membershipCheck = await pool.query(
      'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
      [userId, id]
    );

    // For testing purposes, allow if user created the garden or is admin
    const isCreator = gardenCheck.rows[0].created_by === userId;
    const isCoordinator = membershipCheck.rows.length > 0 && membershipCheck.rows[0].role === 'coordinator';
    const isAdmin = user.role === 'admin';

    if (!isCreator && !isCoordinator && !isAdmin) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `UPDATE gardens
       SET name = $1, location = $2, region = $3, description = $4, max_members = $5,
           crops = $6, features = $7, image_url = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, location, region, description, maxMembers, crops, features, imageUrl, isActive, id]
    );

    res.json({
      message: 'Garden updated successfully',
      garden: result.rows[0]
    });
    return;
  } catch (error) {
    console.error('Update garden error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Delete garden (soft delete)
router.delete('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = user.id;

    // Check if user is coordinator or admin of the garden
    const membershipCheck = await pool.query(
      'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
      [userId, id]
    );

    if (membershipCheck.rows.length === 0 || (membershipCheck.rows[0].role !== 'coordinator' && user.role !== 'admin')) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await pool.query(
      'UPDATE gardens SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.json({ message: 'Garden deactivated successfully' });
    return;
  } catch (error) {
    console.error('Delete garden error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Join garden
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = user.id;

    // Check if garden exists and is active
    const gardenCheck = await pool.query(
      'SELECT max_members FROM gardens WHERE id = $1 AND is_active = true',
      [id]
    );

    if (gardenCheck.rows.length === 0) {
      res.status(404).json({ error: 'Garden not found' });
      return;
    }

    // Check current membership count
    const memberCount = await pool.query(
      'SELECT COUNT(*) as count FROM user_gardens WHERE garden_id = $1 AND is_active = true',
      [id]
    );

    const currentCount = parseInt(memberCount.rows[0]?.count || '0');
    const maxMembers = gardenCheck.rows[0].max_members || 10; // Default to 10 if null

    if (currentCount >= maxMembers) {
      return res.status(400).json({ error: 'Garden is full' });
    }

    // Check if user is already a member
    const existingMembership = await pool.query(
      'SELECT id FROM user_gardens WHERE user_id = $1 AND garden_id = $2',
      [userId, id]
    );

    if (existingMembership.rows.length > 0) {
      // Reactivate membership if it was deactivated
      await pool.query(
        'UPDATE user_gardens SET is_active = true, join_date = CURRENT_TIMESTAMP WHERE user_id = $1 AND garden_id = $2',
        [userId, id]
      );
    } else {
      // Create new membership
      await pool.query(
        'INSERT INTO user_gardens (user_id, garden_id) VALUES ($1, $2)',
        [userId, id]
      );
    }

    res.json({ message: 'Successfully joined garden' });
    return;
  } catch (error) {
    console.error('Join garden error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Leave garden
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = user.id;

    const result = await pool.query(
      'UPDATE user_gardens SET is_active = false WHERE user_id = $1 AND garden_id = $2',
      [userId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ message: 'Successfully left garden' });
    return;
  } catch (error) {
    console.error('Leave garden error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Get garden members
router.get('/:id/members', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = user.id;

    // Check if user is a member of the garden
    const membershipCheck = await pool.query(
      'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
      [userId, id]
    );

    if (membershipCheck.rows.length === 0 && user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.profile_picture_url, ug.role, ug.join_date
       FROM users u
       JOIN user_gardens ug ON u.id = ug.user_id
       WHERE ug.garden_id = $1 AND ug.is_active = true
       ORDER BY ug.join_date ASC`,
      [id]
    );

    res.json({ members: result.rows });
    return;
  } catch (error) {
    console.error('Get garden members error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;



