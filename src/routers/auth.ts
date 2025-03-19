/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { loginController } from "../controllers/auth/login.ts";
import { logoutController } from "../controllers/auth/logout.ts";
import { refreshTokenController } from "../controllers/auth/refresh.ts";
import { generateJSONRequestBody, generateJSONResponse, getErrorResponses } from "../docs/helpers.ts";
import { docs } from "../docs/index.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import {
  loginResponseSchema,
  loginSchema,
  logoutSchema,
  refreshResponseSchema,
  refreshSchema,
} from "../schemas/auth.ts";
import { successResponseSchema } from "../schemas/common-responses.ts";

const authRouter: Router = Router();

authRouter.post(
  "/login",
  docs.path({
    tags: ["auth"],
    summary: "Login",
    description: "Authenticate user with email and password",
    requestBody: generateJSONRequestBody(loginSchema, "Login request body"),
    responses: {
      "200": generateJSONResponse(loginResponseSchema, "Login successful"),
      ...getErrorResponses(["400", "401", "404", "500"]),
    },
  }),
  arktypeRequestValidator(loginSchema, "body"),
  loginController
);

authRouter.post(
  "/refresh",
  docs.path({
    tags: ["auth"],
    summary: "Request refresh token",
    description: "Request refresh token",
    requestBody: generateJSONRequestBody(refreshSchema, "Refresh token request body"),
    responses: {
      "200": generateJSONResponse(refreshResponseSchema, "Refresh token request successful"),
      ...getErrorResponses(["400", "401", "403", "404", "500"]),
    },
  }),
  arktypeRequestValidator(refreshSchema, "body"),
  refreshTokenController
);

authRouter.post(
  "/logout",
  docs.path({
    tags: ["auth"],
    summary: "Logout",
    description: "Logout user",
    requestBody: generateJSONRequestBody(logoutSchema, "Logout request body"),
    responses: {
      "200": generateJSONResponse(successResponseSchema, "Logout successful"),
      ...getErrorResponses(["404", "500"]),
    },
  }),
  arktypeRequestValidator(logoutSchema, "body"),
  logoutController
);

export { authRouter };
