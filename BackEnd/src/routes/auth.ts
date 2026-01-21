import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { validate, registerSchema, loginSchema, updateProfileSchema } from '../middleware/validation.ts';
import { logActivity } from '../middleware/activityLogger.ts';

type AuthRequest = express.Request & {
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

const router = express.Router();

// Register new user
router.post('/register', validate(registerSchema), async (req, res): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName, location, region, bio } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, location, region, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, username, email, first_name, last_name, profile_picture_url, bio, location, region, phone, join_date`,
      [username, email, hashedPassword, firstName, lastName, location, region, bio]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'member' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Log activity
    await logActivity(user.id, 'user_registered', `Nouvel utilisateur inscrit: ${user.username}`);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', validate(loginSchema), async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user by email or username
    const result = await pool.query(
      'SELECT id, username, email, password_hash, first_name, last_name, profile_picture_url, bio, location, region, phone, join_date, last_login, role, is_active FROM users WHERE email = $1 OR username = $1',
      [email]
    );

    console.log('User found:', result.rows.length > 0 ? 'yes' : 'no');

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    if (!user.is_active) {
      res.status(401).json({ error: 'Account is deactivated' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Log activity
    await logActivity(user.id, 'user_login', `Connexion réussie`);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Remove password from response
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userId = authReq.user.id;

    const result = await pool.query(
      `SELECT id, username, email, first_name, last_name, profile_picture_url, bio, location, region, phone, join_date, last_login, role
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validate(updateProfileSchema), async (req, res): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userId = authReq.user.id;
    const { firstName, lastName, bio, location, region, profilePictureUrl, phone } = req.body;

    const updates: string[] = [];
    const values: (string | number | null)[] = [];
    let paramIndex = 1;

    if (firstName !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(lastName);
    }
    if (bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      values.push(bio);
    }
    if (location !== undefined) {
      updates.push(`location = $${paramIndex++}`);
      values.push(location);
    }
    if (region !== undefined) {
      updates.push(`region = $${paramIndex++}`);
      values.push(region);
    }
    if (profilePictureUrl !== undefined) {
      updates.push(`profile_picture_url = $${paramIndex++}`);
      values.push(profilePictureUrl);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(phone);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, username, email, first_name, last_name, profile_picture_url, bio, location, region, phone`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Log activity
    await logActivity(userId, 'profile_updated', `Profil mis à jour`);

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth callback
router.get('/google/callback', async (req, res): Promise<void> => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?error=${error}`);
      return;
    }

    if (!code) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?error=no_code`);
      return;
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json() as { access_token: string };

    if (!tokenResponse.ok) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?error=token_exchange_failed`);
      return;
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userResponse.json() as { email: string; given_name?: string; family_name?: string; picture?: string };

    if (!userResponse.ok) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?error=user_info_failed`);
      return;
    }

    // Check if user exists, if not create them
    let user = await pool.query(
      'SELECT id, username, email, first_name, last_name, profile_picture_url FROM users WHERE email = $1',
      [googleUser.email]
    );

    if (user.rows.length === 0) {
      // Create new user
      const username = googleUser.email.split('@')[0] + Math.random().toString(36).substring(2, 8);
      user = await pool.query(
        `INSERT INTO users (username, email, first_name, last_name, profile_picture_url, password_hash, bio)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, email, first_name, last_name, profile_picture_url`,
        [username, googleUser.email, googleUser.given_name || '', googleUser.family_name || '', googleUser.picture, 'oauth_user', 'Utilisateur Google']
      );
    }

    const dbUser = user.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: dbUser.id, username: dbUser.username, role: 'member' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Log activity
    await logActivity(dbUser.id, 'user_login_oauth', `Connexion via Google`);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?token=${token}&provider=Google`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?error=server_error`);
  }
});

// Facebook OAuth callback
router.get('/facebook/callback', async (req, res): Promise<void> => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/facebook/callback?error=${error}`);
      return;
    }

    if (!code) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/facebook/callback?error=no_code`);
      return;
    }

    // Exchange code for access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI!)}`);
    const tokenData = await tokenResponse.json() as { access_token: string };

    if (!tokenResponse.ok) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/facebook/callback?error=token_exchange_failed`);
      return;
    }

    // Get user info from Facebook
    const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token=${tokenData.access_token}`);
    const facebookUser = await userResponse.json() as { email: string; first_name?: string; last_name?: string; picture?: { data?: { url?: string } } };

    if (!userResponse.ok) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/facebook/callback?error=user_info_failed`);
      return;
    }

    // Check if user exists, if not create them
    let user = await pool.query(
      'SELECT id, username, email, first_name, last_name, profile_picture_url FROM users WHERE email = $1',
      [facebookUser.email]
    );

    if (user.rows.length === 0) {
      // Create new user
      const username = facebookUser.email.split('@')[0] + Math.random().toString(36).substring(2, 8);
      user = await pool.query(
        `INSERT INTO users (username, email, first_name, last_name, profile_picture_url, password_hash, bio)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, username, email, first_name, last_name, profile_picture_url`,
        [username, facebookUser.email, facebookUser.first_name || '', facebookUser.last_name || '', facebookUser.picture?.data?.url || '', 'oauth_user', 'Utilisateur Facebook']
      );
    }

    const dbUser = user.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: dbUser.id, username: dbUser.username, role: 'member' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    // Log activity
    await logActivity(dbUser.id, 'user_login_oauth', `Connexion via Facebook`);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/facebook/callback?token=${token}&provider=Facebook`);
  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/facebook/callback?error=server_error`);
  }
});

export default router;
