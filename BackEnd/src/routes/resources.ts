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

// Get all resources
router.get('/', async (req, res): Promise<void> => {
  try {
    const { resourceType, authorId, tags, search, limit = '20', offset = '0' } = req.query;

    let query = `
      SELECT r.*, u.username as author_username, u.profile_picture_url as author_avatar,
             COUNT(g.id) as guide_count
      FROM resources r
      LEFT JOIN users u ON r.author_id = u.id
      LEFT JOIN guides g ON r.id = g.resource_id
      WHERE r.is_published = true
    `;
    const values: (string | number | string[])[] = [];
    let paramCount = 1;

    if (resourceType) {
      query += ` AND r.resource_type = $${paramCount++}`;
      values.push(resourceType as string);
    }

    if (authorId) {
      query += ` AND r.author_id = $${paramCount++}`;
      values.push(authorId as string);
    }

    if (tags) {
      query += ` AND $${paramCount} = ANY(r.tags)`;
      values.push(tags as string[]);
      paramCount++;
    }

    if (search) {
      query += ` AND (r.title ILIKE $${paramCount} OR r.description ILIKE $${paramCount})`;
      values.push(`%${search as string}%`);
      paramCount++;
    }

    query += ` GROUP BY r.id, u.username, u.profile_picture_url ORDER BY r.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, values);

    res.json({ resources: result.rows });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get resource by ID with guides
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    // Get resource
    const resourceResult = await pool.query(
      `SELECT r.*, u.username as author_username, u.profile_picture_url as author_avatar
       FROM resources r
       LEFT JOIN users u ON r.author_id = u.id
       WHERE r.id = $1 AND r.is_published = true`,
      [id]
    );

    if (resourceResult.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Get associated guides
    const guidesResult = await pool.query(
      `SELECT * FROM guides
       WHERE resource_id = $1
       ORDER BY step_number ASC, created_at ASC`,
      [id]
    );

    res.json({
      resource: resourceResult.rows[0],
      guides: guidesResult.rows
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new resource
router.post('/', authenticateToken, async (req, res): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { title, description, content, resourceType, tags, isPublished } = req.body;

    const result = await pool.query(
      `INSERT INTO resources (title, description, content, resource_type, author_id, tags, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, content, resourceType, userId, tags, isPublished !== false]
    );

    const resource = result.rows[0];

    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update resource
router.put('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { title, description, content, resourceType, tags, isPublished } = req.body;

    // Check if user created the resource or is admin/moderator
    const resourceCheck = await pool.query(
      'SELECT author_id FROM resources WHERE id = $1',
      [id]
    );

    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const isAuthor = resourceCheck.rows[0].author_id === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isAuthor && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `UPDATE resources
       SET title = $1, description = $2, content = $3, resource_type = $4, tags = $5, is_published = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, content, resourceType, tags, isPublished, id]
    );

    res.json({
      message: 'Resource updated successfully',
      resource: result.rows[0]
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete resource
router.delete('/:id', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user created the resource or is admin/moderator
    const resourceCheck = await pool.query(
      'SELECT author_id FROM resources WHERE id = $1',
      [id]
    );

    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const isAuthor = resourceCheck.rows[0].author_id === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isAuthor && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await pool.query('DELETE FROM resources WHERE id = $1', [id]);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add guide to resource
router.post('/:id/guides', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { title, content, stepNumber, imageUrl } = req.body;

    // Check if user created the resource or is admin/moderator
    const resourceCheck = await pool.query(
      'SELECT author_id FROM resources WHERE id = $1',
      [id]
    );

    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const isAuthor = resourceCheck.rows[0].author_id === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isAuthor && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO guides (resource_id, title, content, step_number, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, title, content, stepNumber, imageUrl]
    );

    const guide = result.rows[0];

    res.status(201).json({
      message: 'Guide added successfully',
      guide
    });
  } catch (error) {
    console.error('Add guide error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update guide
router.put('/:resourceId/guides/:guideId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { resourceId, guideId } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { title, content, stepNumber, imageUrl } = req.body;

    // Check if user created the resource or is admin/moderator
    const resourceCheck = await pool.query(
      'SELECT author_id FROM resources WHERE id = $1',
      [resourceId]
    );

    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const isAuthor = resourceCheck.rows[0].author_id === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isAuthor && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const result = await pool.query(
      `UPDATE guides
       SET title = $1, content = $2, step_number = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND resource_id = $6
       RETURNING *`,
      [title, content, stepNumber, imageUrl, guideId, resourceId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Guide not found' });
      return;
    }

    res.json({
      message: 'Guide updated successfully',
      guide: result.rows[0]
    });
  } catch (error) {
    console.error('Update guide error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete guide
router.delete('/:resourceId/guides/:guideId', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { resourceId, guideId } = req.params;
    const userId = (req as AuthRequest).user!.id;

    // Check if user created the resource or is admin/moderator
    const resourceCheck = await pool.query(
      'SELECT author_id FROM resources WHERE id = $1',
      [resourceId]
    );

    if (resourceCheck.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    const isAuthor = resourceCheck.rows[0].author_id === userId;
    const isModerator = (req as AuthRequest).user!.role === 'moderator' || (req as AuthRequest).user!.role === 'admin';

    if (!isAuthor && !isModerator) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await pool.query(
      'DELETE FROM guides WHERE id = $1 AND resource_id = $2',
      [guideId, resourceId]
    );

    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Delete guide error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;



