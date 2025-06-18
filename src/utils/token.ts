import crypto from "crypto";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import config from "../config/env.js";
import { OTPType } from "../schemas/OTP.js";

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

function generateResetPasswordToken(payload: jwt.JwtPayload | { email: string }): string {
  const options: jwt.SignOptions = {
    expiresIn: config.RESET_PASSWORD_TOKEN_LIFETIME as StringValue,
    algorithm: "HS256",
  };

  return jwt.sign({ email: payload.email as string, type: OTPType.RESET_PASSWORD }, config.JWT_SECRET, options);
}

function verifyToken(token: string): jwt.JwtPayload | null {
  return jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
}
export { generateAccessToken, generateRefreshToken, generateResetPasswordToken, verifyToken };
