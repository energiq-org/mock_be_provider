import { Token } from "../models/token";
import { Request, Response } from "express";

async function logoutController(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body as { refreshToken: string };

    const existingToken = await Token.findOne({ where: { refresh_token: refreshToken } });
    if (!existingToken) {
      return res.status(404).json({ msg: "refresh token not found." });
    }

    await Token.update({ revoked_at: new Date() }, { where: { refresh_token: refreshToken } });

    return res.status(200).json({ msg: "token revoked successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}

export { logoutController };
