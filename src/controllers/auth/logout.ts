import { Request, Response } from "express";
import { Token } from "../../models/token";

async function logoutController(req: Request, res: Response) {
  try {
    const { refresh_token } = req.body as { refresh_token: string };

    const existingToken = await Token.findOne({ where: { refresh_token: refresh_token } });
    if (!existingToken) {
      return res.status(404).json({ msg: "refresh token not found." });
    }

    await Token.update({ revoked_at: new Date() }, { where: { refresh_token: refresh_token } });

    return res.status(200).json({ msg: "token revoked successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { logoutController };
