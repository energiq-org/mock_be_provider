/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { loginController } from "../controllers/auth/login.js";
import { logoutController } from "../controllers/auth/logout.js";
import { refreshTokenController } from "../controllers/auth/refresh.js";
import { generateJSONRequestBody, generateJSONResponse, getErrorResponses } from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import {
  loginResponseSchema,
  loginSchema,
  logoutSchema,
  refreshResponseSchema,
  refreshSchema,
} from "../schemas/auth.js";
import { successResponseSchema } from "../schemas/common-responses.js";

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
  ajvRequestValidator(loginSchema, "body"),
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
  ajvRequestValidator(refreshSchema, "body"),
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
  ajvRequestValidator(logoutSchema, "body"),
  logoutController
);

export { authRouter };
