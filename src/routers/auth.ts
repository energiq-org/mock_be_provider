/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { loginController } from "../controllers/auth/login.ts";
import { logoutController } from "../controllers/auth/logout.ts";
import { refreshTokenController } from "../controllers/auth/refresh.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import { loginSchema, logoutSchema, refreshSchema } from "../schemas/auth.ts";

const authRouter: Router = Router();

authRouter.post("/login", arktypeRequestValidator(loginSchema, "body"), loginController);

authRouter.post("/refresh", arktypeRequestValidator(refreshSchema, "body"), refreshTokenController);

authRouter.post("/logout", arktypeRequestValidator(logoutSchema, "body"), logoutController);

export { authRouter };
