import { logoutSchema } from "@src/schemas/auth.js";
import { Request, Response } from "express";
import { Token } from "../../models/token.js";

async function logoutController(req: Request<unknown, unknown, typeof logoutSchema.infer>, res: Response) {
  try {
    const { refresh_token } = req.body;

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
