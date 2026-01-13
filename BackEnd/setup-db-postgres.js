import pkg from 'pg';
const { Pool } = pkg;

async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'green_city_grow_hub',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
  });

  try {
    console.log('Connecting to PostgreSQL database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        profile_picture_url TEXT,
        bio TEXT,
        location VARCHAR(255),
        region VARCHAR(100),
        phone VARCHAR(20),
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin'))
      );
    `);

    // Add updated_at column if it doesn't exist (for existing tables)
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    // Create gardens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gardens (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        region VARCHAR(100) NOT NULL,
        description TEXT,
        max_members INTEGER NOT NULL,
        crops TEXT,
        features TEXT,
        rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
        image_url TEXT,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // Create user_gardens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_gardens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        garden_id INTEGER NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'coordinator', 'admin')),
        is_active BOOLEAN DEFAULT TRUE,
        UNIQUE(user_id, garden_id)
      );
    `);

    console.log('Tables created successfully');

    // Insert sample user if not exists
    const bcrypt = await import('bcryptjs');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.default.hash('password123', saltRounds);

    await pool.query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, location, region, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (username) DO NOTHING
    `, ['testuser', 'test@example.com', hashedPassword, 'Test', 'User', 'Paris', 'Île-de-France', 'Test user for login']);

    console.log('Sample user inserted successfully');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
    console.log('Database setup complete');
  }
}

setupDatabase();
