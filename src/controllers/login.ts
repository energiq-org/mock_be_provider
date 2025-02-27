import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { User } from "../models/user";
import { Token } from "../models/token";
import config from "../config/env";
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../utils/verification_code";
import { VerificationCode } from "../models/verification_code";
import { sendVerificationEmail } from "../services/mail";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ msg: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "invalid Password" });
    }

    const isUserVerified = user.email_verified;

    if (!isUserVerified) {
      const verificationCode = generateVerificationCode();
      const expires_at = new Date(new Date().setMinutes(new Date().getMinutes() + config.VERIFICARTION_TOKEN_LIFETIME));
      await VerificationCode.create({ user_id: user.id, email, code: verificationCode, expires_at });
      await sendVerificationEmail(email, verificationCode);
      return res.status(401).json({ msg: "user is not verified and verification code has been sent" });
    }

    const accessToken = generateAccessToken({ email: email, userId: user.id });

    const refreshToken = generateRefreshToken();
    const value = config.REFRESH_TOKEN_LIFETIME.split("d")[0];

    const expiresAt = new Date(new Date().setDate(new Date().getDate() + Number(value)));

    await Token.create({ refresh_token: refreshToken, user_id: user.id, expires_at: expiresAt });

    return res.status(200).json({
      accessToken,
      accessTokenExpiresIn: config.ACCESS_TOKEN_LIFETIME,
      refreshToken,
      refreshTokenExpiresIn: config.REFRESH_TOKEN_LIFETIME,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}
