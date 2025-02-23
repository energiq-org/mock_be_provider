import jwt from "jsonwebtoken";
import config from "../config/env";
import { StringValue } from "ms";
import crypto from "crypto";

function generateAccessToken(payload: jwt.JwtPayload): string {
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
