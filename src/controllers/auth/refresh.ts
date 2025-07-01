import { refreshSchema } from "../../schemas/controllers/auth/auth.js";
import { Request, Response } from "express";
import { Token } from "../../models/token.js";
import { User } from "../../models/user.js";
import { generateAccessToken } from "../../utils/token.js";
import { Static } from "@sinclair/typebox";

async function refreshTokenController(req: Request<unknown, unknown, Static<typeof refreshSchema>>, res: Response) {
    try {
        const { token } = req.body;

        const storedToken = await Token.findOne({
            where: { refresh_token: token },
        });

        if (!storedToken) {
            return res.status(401).json({ error: "invalid refresh token" });
        }

        if (storedToken.expires_at < new Date(Date.now())) {
            return res.status(403).json({ error: "refresh token expired" });
        }

        if (storedToken.revoked_at !== null) {
            return res.status(403).json({ error: "refresh token has been revoked" });
        }

        const user = await User.findOne({
            where: { id: storedToken.user_id },
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
