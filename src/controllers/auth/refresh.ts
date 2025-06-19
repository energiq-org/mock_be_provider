import { refreshSchema } from "../../schemas/controllers/auth/auth.js";
import { Request, Response } from "express";
import { Token } from "../../models/token.js";
import { User } from "../../models/user.js";
import { generateAccessToken } from "../../utils/token.js";
import { Static } from "@sinclair/typebox";
import { AppDataSource } from "../../config/dbConnection.js";

async function refreshTokenController(req: Request<unknown, unknown, Static<typeof refreshSchema>>, res: Response) {
    try {
        const { token } = req.body;

        const tokenRepository = AppDataSource.getRepository(Token);
        const storedToken = await tokenRepository.findOne({
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

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
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
