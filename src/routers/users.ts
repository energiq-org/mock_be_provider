/* eslint-disable @typescript-eslint/no-misused-promises */
import { sendVerificationEmailController, verifyEmailController } from "@src/controllers/users/mail.ts";
import { Router } from "express";
import { signupController, updateUserController } from "../controllers/users/index.ts";
import { addUserVehicleController } from "../controllers/users/userVehicles.ts";
import { generateJSONRequestBody, generateJSONResponse, getSecuritySchemes } from "../docs/helpers.ts";
import { docs } from "../docs/index.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { profilePictureMiddleware } from "../middlewares/multer.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import {
  badRequestErrorSchema,
  conflictErrorSchema,
  internalServerErrorSchema,
  successResponseSchema,
  unauthorizedErrorSchema,
} from "../schemas/common-responses.ts";
import { sentVerificationEmailSchema, signupSchema, updateUserSchema, verifyEmailSchema } from "../schemas/users.ts";
import { addVehicleSchema } from "../schemas/vehicles.ts";
const usersRouter = Router();

usersRouter.post(
  "/signup",
  docs.path({
    summary: "Signup",
    description: "Signup for a new user",
    tags: ["users"],
    requestBody: generateJSONRequestBody(signupSchema, "The user to signup"),
    responses: {
      201: generateJSONResponse(successResponseSchema, "The user was created successfully"),
      400: generateJSONResponse(badRequestErrorSchema, "The user was not created"),
      409: generateJSONResponse(conflictErrorSchema, "The user already exists"),
      500: generateJSONResponse(internalServerErrorSchema, "The user was not created"),
    },
  }),
  arktypeRequestValidator(signupSchema, "body"),
  signupController
);

usersRouter.patch(
  "/",
  docs.path({
    summary: "Update user",
    description: "Update user",
    tags: ["users"],
    security: getSecuritySchemes(),
    requestBody: generateJSONRequestBody(updateUserSchema, "The user to update"),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The user was updated successfully"),
      400: generateJSONResponse(badRequestErrorSchema, "The user was not updated"),
      401: generateJSONResponse(unauthorizedErrorSchema, "The user was not updated"),
    },
  }),
  authMiddleware,
  profilePictureMiddleware,
  arktypeRequestValidator(updateUserSchema, "body"),
  updateUserController
);

usersRouter.post(
  "/vehicles",
  authMiddleware,
  arktypeRequestValidator(addVehicleSchema, "body"),
  addUserVehicleController
);

usersRouter.post("/verify", arktypeRequestValidator(verifyEmailSchema, "query"), verifyEmailController);

usersRouter.post(
  "/send-verification-email",
  arktypeRequestValidator(sentVerificationEmailSchema, "body"),
  sendVerificationEmailController
);

export { usersRouter };
