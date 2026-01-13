import express from 'express';
import { pool } from '../config/database.ts';
import { authenticateToken, requireRole } from '../middleware/auth.ts';

type AuthRequest = express.Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, first_name, last_name, profile_picture_url, bio, location, region, join_date, last_login, role, is_active
       FROM users ORDER BY join_date DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const currentUserId = authReq.user.id;
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Users can view their own profile or admins can view any profile
    if (parseInt(id) !== currentUserId && authReq.user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `SELECT id, username, email, first_name, last_name, profile_picture_url, bio, location, region, join_date, last_login, role, is_active
       FROM users WHERE id = $1`,
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin or self)
router.put('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const currentUserId = authReq.user.id;
    const { firstName, lastName, bio, location, region, profilePictureUrl, role, isActive } = req.body;

    // Check permissions
    if (parseInt(id) !== currentUserId && authReq.user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Only admins can change role and active status
    const updateFields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramCount = 1;

    if (firstName !== undefined) {
      updateFields.push(`first_name = $${paramCount++}`);
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updateFields.push(`last_name = $${paramCount++}`);
      values.push(lastName);
    }
    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount++}`);
      values.push(bio);
    }
    if (location !== undefined) {
      updateFields.push(`location = $${paramCount++}`);
      values.push(location);
    }
    if (region !== undefined) {
      updateFields.push(`region = $${paramCount++}`);
      values.push(region);
    }
    if (profilePictureUrl !== undefined) {
      updateFields.push(`profile_picture_url = $${paramCount++}`);
      values.push(profilePictureUrl);
    }
    if (authReq.user.role === 'admin') {
      if (role !== undefined) {
        updateFields.push(`role = $${paramCount++}`);
        values.push(role);
      }
      if (isActive !== undefined) {
        updateFields.push(`is_active = $${paramCount++}`);
        values.push(isActive);
      }
    }

    if (updateFields.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(parseInt(id)); // Add id at the end

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Remove password from response
    const user = result.rows[0];
    delete user.password_hash;

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [parseInt(id)]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's gardens
router.get('/:id/gardens', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const currentUserId = authReq.user.id;

    // Users can view their own gardens or admins can view any user's gardens
    if (parseInt(id) !== currentUserId && authReq.user.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `SELECT g.*, ug.role as user_role, ug.join_date as membership_date
       FROM gardens g
       JOIN user_gardens ug ON g.id = ug.garden_id
       WHERE ug.user_id = $1 AND ug.is_active = true
       ORDER BY ug.join_date DESC`,
      [parseInt(id)]
    );

    res.json({ gardens: result.rows });
  } catch (error) {
    console.error('Get user gardens error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;



