import bcrypt from "bcrypt";
import { Request, Response } from "express";
import config from "../../config/env.js";
import { Token } from "../../models/token.js";
import { User } from "../../models/user.js";
import { VerificationCode } from "../../models/verificationCode.js";
import { loginSchema } from "../../schemas/controllers/auth/auth.js";
import { sendVerificationEmail } from "../../utils/mail.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/token.js";
import { generateOTP } from "../../utils/verificationCode.js";
import { Static } from "@sinclair/typebox";

async function loginController(req: Request<unknown, unknown, Static<typeof loginSchema>>, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "invalid Password" });
    }

    const isUserVerified = user.email_verified;
    if (!isUserVerified) {
      const verificationCode = generateOTP();
      const expires_at = new Date(new Date().setMinutes(new Date().getMinutes() + config.VERIFICATION_CODE_LIFETIME));

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
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { loginController };
