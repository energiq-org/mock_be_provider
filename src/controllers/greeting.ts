import { NextFunction, Request, Response } from "express";

function helloController(req: Request, res: Response, next: NextFunction) {
  try {
    const name = ((req.query.name as string) || undefined) ?? "stranger";
    res.status(200).json({ message: `Hello, ${name}!` });
  } catch (err) {
    next(err);
  }
}

export { helloController };
