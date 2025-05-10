import { Request, Response } from "express";
import { User } from "../../models/user.js";
import { VerificationCode } from "../../models/verificationCode.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../../utils/mail.js";
import { verifyEmailSchema, sentVerificationEmailSchema } from "../../schemas/users.js";
import { generateOTP } from "../../utils/verificationCode.js";
import config from "../../config/env.js";
import { Static } from "@sinclair/typebox";

async function verifyEmailController(
  req: Request<unknown, unknown, unknown, Static<typeof verifyEmailSchema>>,
  res: Response
) {
  try {
    const { email, code } = req.query;
    const userVerificationCode = await VerificationCode.findOne({ where: { code } });

    if (!userVerificationCode) {
      return res.status(404).json({ msg: "Code not found" });
    }

    if (userVerificationCode.email !== email) {
      return res.status(400).json({ msg: "Invalid Operation" });
    }

    if (userVerificationCode.used) {
      return res.status(410).json({ msg: "Code has already been used" });
    }

    if (userVerificationCode.expires_at < new Date()) {
      return res.status(410).json({ msg: "Code has expired" });
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

    return res.status(200).json({ msg: "Email verified successfully" });
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
      return res.status(404).json({ message: "user not found" });
    }

    if (user?.email_verified) {
      return res.status(400).json({ msg: "email already verified" });
    }

    const verificationCode = generateOTP();
    const expires_at = Date.now() + config.VERIFICATION_CODE_LIFETIME * 60 * 1000;
    await VerificationCode.create({ user_id: user.id, email, code: verificationCode, expires_at });

    await sendVerificationEmail(email, verificationCode);

    return res.status(200).json({ msg: "verification email sent successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { sendVerificationEmailController, verifyEmailController };
