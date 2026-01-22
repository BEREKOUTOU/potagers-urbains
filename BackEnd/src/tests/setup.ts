/// <reference types="jest" />

import 'dotenv/config';

// Set up test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Mock database connection for tests
jest.mock('../config/database.ts', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

// Mock JWT for tests
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token, secret, callback) => {
    if (token === 'validtoken') {
      callback(null, { id: 1, username: 'testuser', role: 'user' });
    } else {
      callback(new Error('Invalid token'), null);
    }
  }),
  sign: jest.fn(() => 'validtoken'),
}));
