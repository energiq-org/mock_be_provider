import { Request, Response } from "express";
import { User } from "../../models/user.js";
import { OTP } from "../../models/OTP.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../../utils/mail.js";
import { verifyEmailSchema, sentVerificationEmailSchema } from "../../schemas/controllers/users/mail.js";
import { generateOTP } from "../../utils/OTP.js";
import config from "../../config/env.js";
import { Static } from "@sinclair/typebox";

async function verifyEmailController(
  req: Request<unknown, unknown, unknown, Static<typeof verifyEmailSchema>>,
  res: Response
) {
  try {
    const { email, code } = req.query;
    const userVerificationCode = await OTP.findOne({ where: { code, type: "verification" } });

    if (!userVerificationCode) {
      return res.status(404).json({ msg: "verification code not found" });
    }

    if (userVerificationCode.email !== email) {
      return res.status(400).json({ msg: "invalid operation" });
    }

    if (userVerificationCode.used) {
      return res.status(410).json({ msg: "verification code has already been used" });
    }

    if (userVerificationCode.expires_at < new Date()) {
      return res.status(410).json({ msg: "verification code has expired" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (!user.email_verified) {
      await user.update({ email_verified: true });
    }
    await userVerificationCode.update({ used: true });

    await sendWelcomeEmail(email, user.first_name);

    return res.status(200).json({ msg: "email verified successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function sendVerificationEmailController(
  req: Request<unknown, unknown, Static<typeof sentVerificationEmailSchema>>,
  res: Response
) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (user?.email_verified) {
      return res.status(400).json({ msg: "email already verified" });
    }

    const verificationCode = generateOTP();
    const expires_at = Date.now() + config.OTP_LIFETIME * 60 * 1000;
    await OTP.create({ user_id: user.id, email, code: verificationCode, expires_at, type: "verification" });

    await sendVerificationEmail(email, verificationCode);

    return res.status(200).json({ msg: "verification email sent successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { sendVerificationEmailController, verifyEmailController };
