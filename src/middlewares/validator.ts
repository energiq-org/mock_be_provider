import { type } from "arktype";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validateArkTypeSchema } from "../utils/validation.js";

function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg as string;
    return res.status(400).json({ msg: error });
  }
  next();
}

const arktypeRequestValidator =
  (schema: type, source: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => {
    const result = validateArkTypeSchema(req[source], schema);
    if (!result.isValid) {
      return res.status(400).json({ msg: result.message });
    }

    next();
  };

export { arktypeRequestValidator, validateRequest };
