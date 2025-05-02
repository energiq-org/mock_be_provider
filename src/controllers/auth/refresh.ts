import { refreshSchema } from "../../schemas/auth.ts";
import { Request, Response } from "express";
import { Token } from "../../models/token.ts";
import { User } from "../../models/user.ts";
import { generateAccessToken } from "../../utils/token.ts";

async function refreshTokenController(req: Request<unknown, unknown, typeof refreshSchema.infer>, res: Response) {
  try {
    const { token } = req.body;

    const storedToken = await Token.findOne({
      where: { refresh_token: token },
    });

    if (!storedToken) {
      return res.status(401).json({ error: "invalid refresh token" });
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      return res.status(403).json({ error: "refresh token expired" });
    }

    if (storedToken.revoked_at !== null) {
      return res.status(403).json({ error: "refresh token has been revoked" });
    }

    const user = await User.findByPk(storedToken.user_id, {
      paranoid: false,
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { refreshTokenController };
