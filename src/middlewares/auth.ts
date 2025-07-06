import { NextFunction, Request, Response } from "express";
import { accessTokenPayloadSchema } from "../schemas/auth.js";
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

    // Set the full user object and userId for backward compatibility
    req["user"] = tokenPayload.user;
    req["userId"] = tokenPayload.user.id;
    next();
}

export { authMiddleware };
