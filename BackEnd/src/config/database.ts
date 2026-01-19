import 'dotenv/config';
import { Pool } from 'pg';

const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = requiredEnv.filter((k) => !process.env[k]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const dbPort = Number(process.env.DB_PORT);
if (Number.isNaN(dbPort) || dbPort <= 0) {
  throw new Error('Invalid DB_PORT: must be a positive integer');
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: dbPort,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('New client connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
