import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/user";
import { generateVerificationCode } from "../utils/verification_code";
import config from "../config/env";
import { VerificationCode } from "../models/verification_code";
import { sendVerificationEmail } from "../services/mail";

interface userDataType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export async function signupController(req: Request, res: Response) {
  try {
    const { first_name, last_name, email, password } = req.body as userDataType;

    const user = await User.findOne({ where: { email: email } });

    if (user) {
      return res.status(409).json({ msg: "user with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ first_name, last_name, email, password: hashedPassword });

    if (newUser === null) {
      return res.status(500).json({ msg: "user not created" });
    }

    const verificationCode = generateVerificationCode();
    const expires_at = new Date(new Date().setMinutes(new Date().getMinutes() + config.VERIFICARTION_TOKEN_LIFETIME));
    await VerificationCode.create({ user_id: newUser.id, email, code: verificationCode, expires_at });

    await sendVerificationEmail(email, verificationCode);

    return res.status(201).json({ msg: "user created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}
