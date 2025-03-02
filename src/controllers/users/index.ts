import bcrypt from "bcrypt";
import { UUID } from "crypto";
import { Request, Response } from "express";
import path from "path";
import config from "../../config/env.ts";
import { User } from "../../models/user.ts";
import { VerificationCode } from "../../models/verificationCode.ts";
import { sendVerificationEmail } from "../../utils/mail.ts";
import { generateOTP } from "../../utils/verificationCode.ts";

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

    await VerificationCode.create({ user_id: newUser.id, email, code: verificationCode, expires_at });
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ msg: "user created successfully" });
    return;
  } catch (error) {
    res.status(500).json({ msg: (error as Error).message });
    return;
  }
}

async function updateUserController(
  req: Request<
    unknown,
    unknown,
    { first_name: string; last_name: string; email: string; password: string; phone_number: string }
  >,
  res: Response
) {
  const userId = req["userId"] as UUID;
  try {
    const queryBody = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined,
      phone_number: req.body.phone_number,
    };

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${userId}-${Date.now()}${ext}`;
      // Upload the file to S3
      // const fileUrl = await uploadFileToS3(req.file.buffer, fileName);
      const fileUrl = `https://your-bucket-name.s3.your-region.amazonaws.com/${fileName}`;
      queryBody["profile_picture"] = fileUrl;
    }

    await User.update(queryBody, {
      where: {
        id: userId,
      },
    });
    return res.status(200).json("User updated successfully");
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { updateUserController };

  export { signupController };

