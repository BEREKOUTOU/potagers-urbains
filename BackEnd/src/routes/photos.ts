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

// Get all photos
router.get('/', async (req, res): Promise<void> => {
  try {
    const { gardenId, uploadedBy, tags, search, limit = '20', offset = '0' } = req.query;

    let query = `
      SELECT p.*, u.username as uploader_username, u.profile_picture_url as uploader_avatar,
             g.name as garden_name
      FROM photos p
      LEFT JOIN users u ON p.uploaded_by = u.id
      LEFT JOIN gardens g ON p.garden_id = g.id
      WHERE p.is_public = true
    `;
    const values: (string | number | string[])[] = [];
    let paramCount = 1;

    if (gardenId) {
      query += ` AND p.garden_id = $${paramCount++}`;
      values.push(gardenId as string);
    }

    if (uploadedBy) {
      query += ` AND p.uploaded_by = $${paramCount++}`;
      values.push(uploadedBy as string);
    }

    if (tags) {
      query += ` AND $${paramCount} = ANY(p.tags)`;
      values.push(tags as string[]);
      paramCount++;
    }

    if (search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${search as string}%`);
      paramCount++;
    }

    query += ` ORDER BY p.upload_date DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(parseInt(limit as string || '20'), parseInt(offset as string || '0'));

    const result = await pool.query(query, values);

    res.json({ photos: result.rows });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get photo by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, u.username as uploader_username, u.profile_picture_url as uploader_avatar,
              g.name as garden_name
       FROM photos p
       LEFT JOIN users u ON p.uploaded_by = u.id
       LEFT JOIN gardens g ON p.garden_id = g.id
       WHERE p.id = $1 AND p.is_public = true`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    res.json({ photo: result.rows[0] });
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload new photo
router.post('/', authenticateToken, async (req, res): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { title, description, imageUrl, gardenId, tags, isPublic } = req.body;

    // If gardenId is provided, check if user is a member of that garden
    if (gardenId) {
      const membershipCheck = await pool.query(
        'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
        [userId, gardenId]
      );

      if (membershipCheck.rows.length === 0) {
        res.status(403).json({ error: 'You must be a member of the garden to upload photos' });
        return;
      }
    }

    const result = await pool.query(
      `INSERT INTO photos (title, description, image_url, uploaded_by, garden_id, tags, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, imageUrl, userId, gardenId, tags, isPublic !== false]
    );

    const photo = result.rows[0];

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update photo
router.put('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { title, description, tags, isPublic } = req.body;

    // Check if user uploaded the photo or is admin/moderator
    const photoCheck = await pool.query(
      'SELECT uploaded_by FROM photos WHERE id = $1',
      [id]
    );

    if (photoCheck.rows.length === 0) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    const isUploader = photoCheck.rows[0].uploaded_by === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isUploader && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `UPDATE photos
       SET title = $1, description = $2, tags = $3, is_public = $4
       WHERE id = $5
       RETURNING *`,
      [title, description, tags, isPublic, id]
    );

    res.json({
      message: 'Photo updated successfully',
      photo: result.rows[0]
    });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete photo
router.delete('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user uploaded the photo or is admin/moderator
    const photoCheck = await pool.query(
      'SELECT uploaded_by FROM photos WHERE id = $1',
      [id]
    );

    if (photoCheck.rows.length === 0) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    const isUploader = photoCheck.rows[0].uploaded_by === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isUploader && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await pool.query('DELETE FROM photos WHERE id = $1', [id]);

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's photos
router.get('/user/:userId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as AuthRequest).user!.id;

    // Users can view their own photos or public photos of others
    let query;
    let values;

    if (parseInt(userId!) === currentUserId) {
      // User viewing their own photos
      query = `SELECT * FROM photos WHERE uploaded_by = $1 ORDER BY upload_date DESC`;
      values = [userId];
    } else {
      // User viewing someone else's public photos
      query = `SELECT * FROM photos WHERE uploaded_by = $1 AND is_public = true ORDER BY upload_date DESC`;
      values = [userId];
    }

    const result = await pool.query(query, values);

    res.json({ photos: result.rows });
  } catch (error) {
    console.error('Get user photos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;



