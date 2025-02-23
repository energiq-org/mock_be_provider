import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { User } from "../models/user";
import { Token } from "../models/token";
import config from "../config/env";
import bcrypt from "bcrypt";

async function loginController(req: Request, res: Response) {
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

    const accessToken = generateAccessToken({ email: email, userId: user.id });

    const refreshToken = generateRefreshToken();
    const value = config.REFRESH_TOKEN_LIFETIME.split("d")[0];
    console.log(value);

    const expiresAt = new Date(new Date().setDate(new Date().getDate() + Number(value)));

    res.header("Authorization", `Bearer ${accessToken}`);

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

export { loginController };
