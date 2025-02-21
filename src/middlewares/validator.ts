import { Request, Response, NextFunction } from 'express';
import { body , validationResult } from 'express-validator';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error =  errors.array()[0].msg as string;
        return res.status(400).json({ msg: error });
    }
    next();
};



export const validateRefreshToken = [
    body("token")
      .isString().withMessage("Token must be a string")
        .notEmpty().withMessage("Token is required"),
    
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

export default validateRequest;