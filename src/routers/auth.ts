/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { loginController } from "../controllers/auth/login.ts";
import { logoutController } from "../controllers/auth/logout.ts";
import { refreshTokenController } from "../controllers/auth/refresh.ts";
import { arktypeValidator } from "../middlewares/validator.ts";
import { loginSchema, logoutSchema, refreshSchema } from "../schemas/auth.ts";

const authRouter: Router = Router();

authRouter.post("/login", arktypeValidator(loginSchema, "body"), loginController);

authRouter.post("/refresh", arktypeValidator(refreshSchema, "body"), refreshTokenController);

authRouter.post("/logout", arktypeValidator(logoutSchema, "body"), logoutController);

export { authRouter };
