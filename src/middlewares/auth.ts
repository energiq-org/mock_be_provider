import { UUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers["authorization"] as string)?.split(" ")[1];
  if (token === undefined) {
    return res.status(401).json({ msg: "invalid token" });
  }

  let tokenPayload: jwt.JwtPayload | string;
  try {
    tokenPayload = jwt.verify(token, config.JWT_SECRET);
  } catch {
    return res.status(401).json({ msg: "unauthorized" });
  }

  if (typeof tokenPayload === "string") {
    return res.status(401).json({ msg: "invalid token payload" });
  }

  req["userId"] = tokenPayload.userId as UUID;
  next();
}

export { authMiddleware };
