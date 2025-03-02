import { UUID } from "crypto";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/user";
import path from "path";

async function updateUserController(req: Request, res: Response) {
  try {
    const userId = req["userId"] as UUID;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { first_name, last_name, email, password, phone_number } = req.body as {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone_number: string;
    };
    const updatedData = {};

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${userId}-${Date.now()}${ext}`;
      // Upload the file to S3
      // const fileUrl = await uploadFileToS3(req.file.buffer, fileName);
      const fileUrl = `https://your-bucket-name.s3.your-region.amazonaws.com/${fileName}`;
      updatedData["profile_picture"] = fileUrl;
    }
    if (first_name) {
      updatedData["first_name"] = first_name;
    }
    if (last_name) {
      updatedData["last_name"] = last_name;
    }
    if (email) {
      updatedData["email"] = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData["password"] = hashedPassword;
    }
    if (phone_number) {
      updatedData["phone_number"] = phone_number;
    }
    await User.update(updatedData, {
      where: {
        id: userId,
      },
    });
    res.status(200).json(updatedData);
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { updateUserController };
