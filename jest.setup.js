// jest.setup.js
const dotenv = require('dotenv');
const path = require('path');

// First try to load test-specific env vars
let result = dotenv.config({ path: path.resolve(__dirname, '.env') });

// If test env file doesn't exist, fall back to regular .env
if (result.error) {
    console.log('No .env.test found, falling back to .env');
    result = dotenv.config({ path: path.resolve(__dirname, '.env') });
}

// Manually set critical environment variables if they're still missing
const criticalVars = {
    'DB_HOST': process.env.DB_HOST || 'localhost',
    'DB_USERNAME': process.env.DB_USERNAME || 'test_user',
    'DB_PASSWORD': process.env.DB_PASSWORD || 'test_password',
    'DB_NAME': process.env.DB_NAME || 'test_db',
    'JWT_SECRET': process.env.JWT_SECRET || 'test-jwt-secret'
};

// Apply missing critical variables
Object.entries(criticalVars).forEach(([key, value]) => {
    if (!process.env[key]) {
        process.env[key] = value;
        console.log(`Setting missing env var ${key}`);
    }
});

console.log('Test environment setup complete');