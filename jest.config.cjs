module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/BackEnd/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: [
    'BackEnd/src/**/*.ts',
    '!BackEnd/src/**/*.d.ts',
    '!BackEnd/src/**/__tests__/**',
    '!BackEnd/src/**/*.test.ts',
    '!BackEnd/src/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/BackEnd/src/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/BackEnd/src/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
};
