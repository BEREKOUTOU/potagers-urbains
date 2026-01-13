import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  try {
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });

    console.log('Connected to SQLite database');

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        profile_picture_url TEXT,
        bio TEXT,
        location TEXT,
        region TEXT,
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1,
        role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin'))
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS gardens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        region TEXT NOT NULL,
        description TEXT,
        max_members INTEGER NOT NULL,
        crops TEXT,
        features TEXT,
        rating REAL CHECK (rating >= 0 AND rating <= 5),
        image_url TEXT,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_gardens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        garden_id INTEGER NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'member' CHECK (role IN ('member', 'coordinator', 'admin')),
        is_active BOOLEAN DEFAULT 1,
        UNIQUE(user_id, garden_id)
      );
    `);

    console.log('Tables created successfully');

    // Insert sample user
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    await db.run(`
      INSERT OR IGNORE INTO users (username, email, password, first_name, last_name, location, region, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, ['testuser', 'test@example.com', hashedPassword, 'Test', 'User', 'Paris', 'Île-de-France', 'Test user for login']);

    console.log('Sample user inserted successfully');

    await db.close();
    console.log('Database setup complete');

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
