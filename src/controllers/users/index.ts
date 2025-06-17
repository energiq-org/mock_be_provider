import bcrypt from "bcrypt";
import { UUID } from "crypto";
import { Request, Response } from "express";
import config from "../../config/env.js";
import { User } from "../../models/user.js";
import { OTP } from "../../models/OTP.js";
import { sendVerificationEmail } from "../../utils/mail.js";
import { generateOTP } from "../../utils/OTP.js";
import { signupSchema, updateUserPasswordSchema, updateUserSchema } from "../../schemas/controllers/users/user.js";
import * as jdenticon from "jdenticon";
import { awsFolderNames, s3Handler } from "../../utils/s3.js";

import { Static } from "@sinclair/typebox";

async function signupController(req: Request<unknown, unknown, Static<typeof signupSchema>>, res: Response) {
  try {
    const { first_name, last_name, email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      res.status(409).json({ msg: "user with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const profile_picture = jdenticon.toPng(userId, 400);
    const fileUrl = await s3Handler.uploadFile(
      config.S3_BUCKET_NAME,
      awsFolderNames.userProfile(userId),
      profile_picture
    );
    const newUser = await User.create({
      id: userId,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      profile_picture: fileUrl,
    });
    const verificationCode = generateOTP();
    const expires_at = Date.now() + config.OTP_LIFETIME * 60 * 1000;

    await OTP.create({ user_id: newUser.id, email, code: verificationCode, expires_at, type: "verification" });
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ msg: "user created successfully" });
    return;
  } catch (error) {
    res.status(500).json({ msg: (error as Error).message });
    return;
  }
}

async function updateUserController(req: Request<unknown, unknown, Static<typeof updateUserSchema>>, res: Response) {
  const userId = req["userId"] as UUID;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const queryBody = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
    };

    if (queryBody.email != null) {
      if (queryBody.email != user.email) {
        const user = await User.findOne({ where: { email: queryBody.email } });
        if (user) {
          return res.status(409).json({ msg: "this email is already in use" });
        }
      } else {
        return res.status(400).json({ msg: "new email cannot be the same as the current email" });
      }
    }

    if (queryBody.phone_number != null) {
      if (queryBody.phone_number != user.phone_number) {
        const user = await User.findOne({ where: { phone_number: queryBody.phone_number } });
        if (user) {
          return res.status(409).json({ msg: "this phone number is already in use" });
        }
      }
    }

    if (req.file) {
      queryBody["profile_picture"] = await s3Handler.uploadFile(
        config.S3_BUCKET_NAME,
        awsFolderNames.userProfile(userId),
        req.file.buffer
      );
    } else {
      const allFieldsUndefined = Object.values(queryBody).every((value) => value === undefined);
      if (allFieldsUndefined) {
        return res.status(400).json({ msg: "no data to update" });
      }
    }

    await user.update(queryBody);

    return res.status(200).json({ msg: "user data updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}
async function getUserController(req: Request, res: Response) {
  const userId = req["userId"] as UUID;
  try {
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const vehicles = await user.getVehiclesTransformed();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, no-unused-vars
    const { password, ...userData } = user.toJSON();
    return res.status(200).json({
      ...userData,
      vehicles,
    });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}
async function updateUserPasswordController(
  req: Request<unknown, unknown, Static<typeof updateUserPasswordSchema>>,
  res: Response
) {
  const userId = req["userId"] as UUID;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const isPasswordValid = await bcrypt.compare(req.body.old_password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "invalid password" });
    }
    // Check if new password is the same as old password
    const isSamePassword = await bcrypt.compare(req.body.new_password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ msg: "new password cannot be the same as the old password" });
    }

    const hashedNewPassword = await bcrypt.hash(req.body.new_password, 10);

    await user.update({ password: hashedNewPassword });
    return res.status(200).json({ msg: "password updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}
async function deleteUserController(req: Request, res: Response) {
  const userId = req["userId"] as UUID;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    await user.destroy();
    return res.status(200).json({ msg: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function getUserVehiclesController(req: Request, res: Response) {
  const userId = req["userId"] as UUID;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const vehicles = await user.getVehiclesTransformed();
    return res.status(200).json(vehicles);
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export {
  signupController,
  updateUserController,
  getUserController,
  updateUserPasswordController,
  deleteUserController,
  getUserVehiclesController,
};
