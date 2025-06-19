import { NextFunction, Request, Response } from "express";
import { accessTokenPayloadSchema } from "../schemas/token.js";
import { validateTypeboxSchema } from "../utils/validation.js";
import { Static } from "@sinclair/typebox";
import { verifyToken } from "../utils/token.js";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers["authorization"] as string)?.split(" ")[1];
    if (token === undefined) {
        return res.status(401).json({ msg: "invalid token" });
    }

    let tokenPayload: Static<typeof accessTokenPayloadSchema>;
    try {
        tokenPayload = verifyToken(token) as Static<typeof accessTokenPayloadSchema>;
    } catch {
        return res.status(401).json({ msg: "unauthorized" });
    }

    if (!validateTypeboxSchema(tokenPayload, accessTokenPayloadSchema).isValid) {
        return res.status(401).json({ msg: "invalid token" });
    }

    req["userId"] = tokenPayload.userId;
    next();
}

export { authMiddleware };
