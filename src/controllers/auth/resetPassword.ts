import { User } from "../../models/user.js";
import {
  forgetPasswordSchema,
  resetPasswordSchema,
  verifyPasswordResetOTPSchema,
} from "../../schemas/controllers/auth/auth.js";
import { resetTokenPayloadSchema } from "../../schemas/token.js";
import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { generateOTP } from "../../utils/OTP.js";
import { OTP } from "../../models/OTP.js";
import { OTPType } from "../../schemas/OTP.js";
import config from "../../config/env.js";
import { sendResetPasswordEmail } from "../../utils/mail.js";
import { generateResetPasswordToken, verifyToken } from "../../utils/token.js";
import jwt from "jsonwebtoken";
import { validateTypeboxSchema } from "../../utils/validation.js";
import bcrypt from "bcrypt";
async function forgetPasswordController(
  req: Request<unknown, unknown, Static<typeof forgetPasswordSchema>>,
  res: Response
) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const resetPasswordCode = generateOTP();
    const expires_at = Date.now() + config.OTP_LIFETIME * 60 * 1000;
    await OTP.create({
      user_id: user.id,
      email: user.email,
      code: resetPasswordCode,
      expires_at,
      type: OTPType.RESET_PASSWORD,
    });

    await sendResetPasswordEmail(user.email, resetPasswordCode);

    return res.status(200).json({ msg: "Reset password email sent" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function verifyPasswordResetOTPController(
  req: Request<unknown, unknown, Static<typeof verifyPasswordResetOTPSchema>>,
  res: Response
) {
  try {
    const { email, code } = req.body;
    const resetPasswordCode = await OTP.findOne({ where: { code, type: OTPType.RESET_PASSWORD } });
    if (!resetPasswordCode) {
      return res.status(404).json({ msg: "reset password code not found" });
    }
    if (resetPasswordCode.email !== email) {
      return res.status(400).json({ msg: "invalid operation" });
    }
    if (resetPasswordCode.expires_at < new Date()) {
      return res.status(400).json({ msg: "reset password code expired" });
    }
    if (resetPasswordCode.used) {
      return res.status(400).json({ msg: "reset password code already used" });
    }
    await resetPasswordCode.update({ used: true });
    const token = generateResetPasswordToken({ email: resetPasswordCode.email });
    return res
      .status(200)
      .json({ msg: "reset password code verified", token, expires_at: config.RESET_PASSWORD_TOKEN_LIFETIME });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function resetPasswordController(
  req: Request<unknown, unknown, Static<typeof resetPasswordSchema>>,
  res: Response
) {
  try {
    const { new_password, token } = req.body;
    const decoded = verifyToken(token) as Static<typeof resetTokenPayloadSchema>;

    if (!validateTypeboxSchema(decoded, resetTokenPayloadSchema).isValid) {
      return res.status(400).json({ msg: "invalid token" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await User.update({ password: hashedPassword }, { where: { email: decoded.email } });

    return res.status(200).json({ msg: "password reset successfully" });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ msg: "invalid token" });
    }
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { forgetPasswordController, verifyPasswordResetOTPController, resetPasswordController };
