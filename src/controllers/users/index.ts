import bcrypt from "bcrypt";
import { UUID } from "crypto";
import { Request, Response } from "express";
import config from "../../config/env.ts";
import { User } from "../../models/user.ts";
import { VerificationCode } from "../../models/verificationCode.ts";
import { sendVerificationEmail } from "../../utils/mail.ts";
import { generateOTP } from "../../utils/verificationCode.ts";
import { signupSchema, updateUserSchema } from "../../schemas/users.ts";
import * as jdenticon from "jdenticon";
import { awsFolderNames, s3Handler } from "../../utils/s3.ts";
import { UserVehicle } from "../../models/userVehicles.ts";
import { fuzzySearcher, Vehicle } from "../../utils/vehiclesStore.ts";

async function signupController(req: Request<unknown, unknown, typeof signupSchema.infer>, res: Response) {
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

async function updateUserController(req: Request<unknown, unknown, typeof updateUserSchema.infer>, res: Response) {
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
      password: req.body.password != null ? await bcrypt.hash(req.body.password, 10) : undefined,
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

    if (req.file) {
      const fileUrl = await s3Handler.uploadFile(
        config.S3_BUCKET_NAME,
        awsFolderNames.userProfile(userId),
        req.file.buffer
      );
      queryBody["profile_picture"] = fileUrl;
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
      include: [
        {
          model: UserVehicle,
          as: "user_vehicles",
          attributes: { exclude: ["user_id"] },
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const vehicleIds = user.user_vehicles?.map((vehicle) => vehicle.vehicle_id) ?? [];

    const vehicles: Vehicle[] = [];
    for (const vehicleId of vehicleIds) {
      const vehicle = fuzzySearcher.findById(vehicleId);
      if (vehicle) {
        vehicles.push(vehicle);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, no-unused-vars
    const { password, user_vehicles, ...userData } = user.toJSON();
    return res.status(200).json({
      ...userData,
      vehicles,
    });
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

export { signupController, updateUserController, getUserController, deleteUserController };
