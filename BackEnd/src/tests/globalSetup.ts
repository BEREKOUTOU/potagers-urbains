import 'dotenv/config';

// Jest configuration setup for all tests
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing-only';
  process.env.DB_HOST = process.env.DB_HOST || 'localhost';
  process.env.DB_PORT = process.env.DB_PORT || '5432';
  process.env.DB_NAME = process.env.DB_NAME || 'test_db';
  process.env.DB_USER = process.env.DB_USER || 'test_user';
  process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test_password';
});

// Clean up after all tests
afterAll(() => {
  jest.clearAllMocks();
});

// Global test timeout
jest.setTimeout(10000);
