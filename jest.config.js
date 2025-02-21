
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: [
    '**/src/**/*.test.ts',
    '**/src/**/__tests__/**/*.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testTimeout: 10000,
  verbose: true,
  //setupFiles: ['<rootDir>/jest.setup.js'],

  testEnvironmentOptions: {
    env: {
      NODE_ENV: 'test'
    }
  }

};

module.exports = config;
