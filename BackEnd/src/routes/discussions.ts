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

// Get all discussions
router.get('/', async (req, res) => {
  try {
    const { gardenId, category, limit = '20', offset = '0' } = req.query;

    let query = `
      SELECT d.*, u.username as author_username, u.profile_picture_url as author_avatar,
             g.name as garden_name, COUNT(dr.id) as reply_count
      FROM discussions d
      LEFT JOIN users u ON d.author_id = u.id
      LEFT JOIN gardens g ON d.garden_id = g.id
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id AND dr.is_active = true
      WHERE d.is_active = true
    `;
    const values: (string | number)[] = [];
    let paramCount = 1;

    if (gardenId) {
      query += ` AND d.garden_id = $${paramCount++}`;
      values.push(gardenId as string);
    }

    if (category) {
      query += ` AND d.category = $${paramCount++}`;
      values.push(category as string);
    }

    query += ` GROUP BY d.id, u.username, u.profile_picture_url, g.name ORDER BY d.is_pinned DESC, d.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, values);

    return res.json({ discussions: result.rows });
  } catch (error) {
    console.error('Get discussions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get discussion by ID with replies
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get discussion
    const discussionResult = await pool.query(
      `SELECT d.*, u.username as author_username, u.profile_picture_url as author_avatar,
              g.name as garden_name
       FROM discussions d
       LEFT JOIN users u ON d.author_id = u.id
       LEFT JOIN gardens g ON d.garden_id = g.id
       WHERE d.id = $1 AND d.is_active = true`,
      [id]
    );

    if (discussionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Get replies
    const repliesResult = await pool.query(
      `SELECT dr.*, u.username as author_username, u.profile_picture_url as author_avatar,
              parent.author_username as parent_author_username
       FROM discussion_replies dr
       LEFT JOIN users u ON dr.author_id = u.id
       LEFT JOIN discussion_replies parent ON dr.parent_reply_id = parent.id
       WHERE dr.discussion_id = $1 AND dr.is_active = true
       ORDER BY dr.created_at ASC`,
      [id]
    );

    return res.json({
      discussion: discussionResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (error) {
    console.error('Get discussion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new discussion
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;
    const { title, content, gardenId, category, isPinned } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If gardenId is provided, check if user is a member of that garden
    if (gardenId) {
      const membershipCheck = await pool.query(
        'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
        [userId, gardenId]
      );

      if (membershipCheck.rows.length === 0) {
        return res.status(403).json({ error: 'You must be a member of the garden to post discussions' });
      }
    }

    const result = await pool.query(
      `INSERT INTO discussions (title, content, author_id, garden_id, category, is_pinned)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content, userId, gardenId, category, isPinned || false]
    );

    const discussion = result.rows[0];

    return res.status(201).json({
      message: 'Discussion created successfully',
      discussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update discussion
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;
    const { title, content, category, isPinned } = req.body;

    // Check if user created the discussion or is admin
    const discussionCheck = await pool.query(
      'SELECT author_id FROM discussions WHERE id = $1',
      [id]
    );

    if (discussionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const isAuthor = discussionCheck.rows[0].author_id === userId;
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE discussions
       SET title = $1, content = $2, category = $3, is_pinned = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, content, category, isPinned, id]
    );

    return res.json({
      message: 'Discussion updated successfully',
      discussion: result.rows[0]
    });
  } catch (error) {
    console.error('Update discussion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete discussion (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;

    // Check if user created the discussion or is admin
    const discussionCheck = await pool.query(
      'SELECT author_id FROM discussions WHERE id = $1',
      [id]
    );

    if (discussionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const isAuthor = discussionCheck.rows[0].author_id === userId;
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query(
      'UPDATE discussions SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    return res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Delete discussion error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add reply to discussion
router.post('/:id/reply', authenticateToken, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user!.id;
    const { content } = req.body;

    // Check if discussion exists
    const discussionCheck = await pool.query(
      'SELECT id FROM discussions WHERE id = $1',
      [id]
    );

    if (discussionCheck.rows.length === 0) {
      res.status(404).json({ error: 'Discussion not found' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO discussion_replies (discussion_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, userId, content]
    );

    const reply = result.rows[0];

    res.status(201).json({
      message: 'Reply added successfully',
      reply
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create reply to discussion
router.post('/:id/replies', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;
    const { content, parentReplyId } = req.body;

    // Check if discussion exists and is active
    const discussionCheck = await pool.query(
      'SELECT id, garden_id FROM discussions WHERE id = $1 AND is_active = true',
      [id]
    );

    if (discussionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // If discussion belongs to a garden, check membership
    if (discussionCheck.rows[0].garden_id) {
      const membershipCheck = await pool.query(
        'SELECT role FROM user_gardens WHERE user_id = $1 AND garden_id = $2 AND is_active = true',
        [userId, discussionCheck.rows[0].garden_id]
      );

      if (membershipCheck.rows.length === 0) {
        return res.status(403).json({ error: 'You must be a member of the garden to reply' });
      }
    }

    const result = await pool.query(
      `INSERT INTO discussion_replies (discussion_id, author_id, content, parent_reply_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, userId, content, parentReplyId || null]
    );

    const reply = result.rows[0];

    return res.status(201).json({
      message: 'Reply created successfully',
      reply
    });
  } catch (error) {
    console.error('Create reply error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reply
router.put('/:discussionId/replies/:replyId', authenticateToken, async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;
    const { content } = req.body;

    // Check if user created the reply or is admin/moderator
    const replyCheck = await pool.query(
      'SELECT author_id FROM discussion_replies WHERE id = $1 AND discussion_id = $2',
      [replyId, discussionId]
    );

    if (replyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const isAuthor = replyCheck.rows[0].author_id === userId;
    const isModerator = user.role === 'moderator' || user.role === 'admin';

    if (!isAuthor && !isModerator) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `UPDATE discussion_replies
       SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND discussion_id = $3
       RETURNING *`,
      [content, replyId, discussionId]
    );

    return res.json({
      message: 'Reply updated successfully',
      reply: result.rows[0]
    });
  } catch (error) {
    console.error('Update reply error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete reply (soft delete)
router.delete('/:discussionId/replies/:replyId', authenticateToken, async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user.id;

    // Check if user created the reply or is admin/moderator
    const replyCheck = await pool.query(
      'SELECT author_id FROM discussion_replies WHERE id = $1 AND discussion_id = $2',
      [replyId, discussionId]
    );

    if (replyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const isAuthor = replyCheck.rows[0].author_id === userId;
    const isModerator = user.role === 'moderator' || user.role === 'admin';

    if (!isAuthor && !isModerator) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query(
      'UPDATE discussion_replies SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND discussion_id = $2',
      [replyId, discussionId]
    );

    return res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Delete reply error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;



