import bcrypt from "bcrypt";
import { Request, Response } from "express";
import config from "../../config/env";
import { User } from "../../models/user";
import { VerificationCode } from "../../models/verificationCode";
import { sendVerificationEmail } from "../../services/mail";
import { generateOTP } from "../../utils/verificationCode";
import jdenticon from "jdenticon";
import fs from "fs";

async function signupController(req: Request, res: Response) {
  try {
    const { first_name, last_name, email, password } = req.body as {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    };

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.status(409).json({ msg: "user with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ first_name, last_name, email, password: hashedPassword });
    const verificationCode = generateOTP();
    const expires_at = Date.now() + config.VERIFICATION_CODE_LIFETIME * 60 * 1000;

    const png = jdenticon.toPng(newUser.id, 400);
    //will create a file named testicon.png in the root directory of the project for testing purposes , later we will upload it to s3
    fs.writeFileSync("./testicon.png", png);

    await VerificationCode.create({ user_id: newUser.id, email, code: verificationCode, expires_at });
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ msg: "user created successfully" });
    return;
  } catch (error) {
    res.status(500).json({ msg: (error as Error).message });
    return;
  }
}

export { signupController };
