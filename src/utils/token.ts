import jwt from 'jsonwebtoken';
import config from '../config/env';
import {StringValue} from 'ms'
import crypto from 'crypto';


const generateAccessToken = (payload: jwt.JwtPayload | { userId: number; email: string }): string => {
    try {
        const options: jwt.SignOptions = {
            expiresIn: config.ACCESS_TOKEN_LIFETIME as StringValue ,
            algorithm: 'HS256'
        };
        return jwt.sign(payload ,config.JWT_SECRET , options);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Access Token generation failed: ${error.message}`);
        }
    }
    throw new Error('Access Token generation failed');
};

const generateRefreshToken = (): string => {
    try {
        return crypto.randomBytes(64).toString('hex');

    }catch(error){
        if (error instanceof Error) {
            throw new Error(`Refresh Token generation failed: ${error.message}`);
        }
    }
    throw new Error('Refresh Token generation failed');
};


const parseExpiration = (expirationString : string) => {
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

export { generateAccessToken , generateRefreshToken  , parseExpiration };