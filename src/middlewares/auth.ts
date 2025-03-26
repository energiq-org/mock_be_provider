import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.ts";
import { accessTokenPayloadSchema } from "../schemas/auth.ts";
import { validateArkTypeSchema } from "../utils/validation.ts";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers["authorization"] as string)?.split(" ")[1];
  if (token === undefined) {
    return res.status(401).json({ msg: "invalid token" });
  }

  let tokenPayload: typeof accessTokenPayloadSchema.infer;
  try {
    tokenPayload = jwt.verify(token, config.JWT_SECRET) as typeof accessTokenPayloadSchema.infer;
  } catch {
    return res.status(401).json({ msg: "unauthorized" });
  }

  if (!validateArkTypeSchema(tokenPayload, accessTokenPayloadSchema).isValid) {
    return res.status(401).json({ msg: "invalid token" });
  }

  req["userId"] = tokenPayload.userId;
  next();
}

export { authMiddleware };
