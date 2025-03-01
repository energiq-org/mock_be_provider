/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { body } from "express-validator";
import { loginController } from "../controllers/auth/login";
import { logoutController } from "../controllers/auth/logout";
import { refreshTokenController } from "../controllers/auth/refresh";
import { signupController } from "../controllers/signup";
import { validateRequest } from "../middlewares/validator";

const authRouter: Router = Router();

authRouter.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Emaild").trim(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters long"),
  ],
  validateRequest,
  loginController
);

authRouter.post(
  "/signup",
  [
    body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isString()
      .withMessage("Invalid First Name")
      .trim(),
    body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .isString()
      .withMessage("Invalid Last Name")
      .trim(),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Emaild").trim(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters long"),
  ],
  validateRequest,
  signupController
);

authRouter.post(
  "/refresh",
  [body("token").notEmpty().withMessage("Token is required").isString().withMessage("Invalid Token").trim()],
  refreshTokenController
);

authRouter.post(
  "/logout",
  [body("refresh_token").notEmpty().withMessage("token is required").isString().withMessage("invalid Token").trim()],
  validateRequest,
  logoutController
);

export { authRouter };
