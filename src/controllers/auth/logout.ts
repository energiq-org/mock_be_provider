import { logoutSchema } from "../../schemas/controllers/auth/auth.js";
import { Request, Response } from "express";
import { Token } from "../../models/token.js";
import { Static } from "@sinclair/typebox";
import { AppDataSource } from "../../config/dbConnection.js";

async function logoutController(req: Request<unknown, unknown, Static<typeof logoutSchema>>, res: Response) {
    try {
        const { refresh_token } = req.body;

        const tokenRepository = AppDataSource.getRepository(Token);
        const existingToken = await tokenRepository.findOne({ where: { refresh_token } });
        if (!existingToken) {
            return res.status(404).json({ msg: "refresh token not found." });
        }

        existingToken.revoked_at = new Date();
        await tokenRepository.save(existingToken);

        return res.status(200).json({ msg: "token revoked successfully" });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { logoutController };
