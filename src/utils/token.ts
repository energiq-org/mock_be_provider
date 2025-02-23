import jwt from 'jsonwebtoken';
import config from '../config/env';
import { StringValue } from 'ms';
import crypto from 'crypto';

// Ensure config types are strict
interface Config {
  JWT_SECRET: string;
  ACCESS_TOKEN_LIFETIME: StringValue;
}

const typedConfig = config as Config;

const generateAccessToken = (payload: jwt.JwtPayload | { userId: number; email: string }): string => {
  try {
    const options: jwt.SignOptions = {
      expiresIn: typedConfig.ACCESS_TOKEN_LIFETIME,
      algorithm: 'HS256',
    };
    return jwt.sign(payload, typedConfig.JWT_SECRET, options) as string; // Explicitly type the return
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Access Token generation failed: ${error.message}`);
    }
    throw new Error('Access Token generation failed'); // This line is unreachable but kept for consistency
  }
};

const generateRefreshToken = (): string => {
  try {
    return crypto.randomBytes(64).toString('hex');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Refresh Token generation failed: ${error.message}`);
    }
    throw new Error('Refresh Token generation failed'); // This line is unreachable but kept for consistency
  }
};

const parseExpiration = (expirationString: string) => {
  if (!expirationString) {
    throw new Error('Expiration string is required');
  }

  const match = expirationString.match(/^(\d+)([dhm])$/);
  if (!match) {
    throw new Error('Invalid expiration format.');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return { value, unit };
};

export { generateAccessToken, generateRefreshToken, parseExpiration };