import crypto from "crypto";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import config from "../config/env.ts";

function generateAccessToken(payload: jwt.JwtPayload | { userId: number; email: string }): string {
  const options: jwt.SignOptions = {
    expiresIn: config.ACCESS_TOKEN_LIFETIME as StringValue,
    algorithm: "HS256",
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export { generateAccessToken, generateRefreshToken };
