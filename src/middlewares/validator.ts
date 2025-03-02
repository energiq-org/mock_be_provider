import { type } from "arktype";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg as string;
    return res.status(400).json({ msg: error });
  }
  next();
}

const arktypeValidator =
  (schema: type, source: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema(req[source]);
    if (validationResult instanceof type.errors) {
      return res.status(400).json({ msg: validationResult.summary });
    }

    next();
  };

export { arktypeValidator, validateRequest };
