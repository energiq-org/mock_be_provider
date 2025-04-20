/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  signupController,
  updateUserController,
  getUserController,
  deleteUserController,
} from "../controllers/users/index.ts";
import { sendVerificationEmailController, verifyEmailController } from "../controllers/users/mail.ts";
import { addUserVehicleController, deleteUserVehicleController } from "../controllers/users/userVehicles.ts";
import {
  generateJSONRequestBody,
  generateJSONResponse,
  getErrorResponses,
  getSecuritySchemes,
  generateUpdateUserRequestBody,
  generateRequestParameters,
} from "../docs/helpers.ts";
import { docs } from "../docs/index.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { profilePictureMiddleware } from "../middlewares/multer.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import { successResponseSchema } from "../schemas/common-responses.ts";
import { sentVerificationEmailSchema, signupSchema, updateUserSchema, verifyEmailSchema } from "../schemas/users.ts";
import { vehicleIdSchema } from "../schemas/vehicles.ts";

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
      ...getErrorResponses(["409", "500"]),
    },
  }),
  arktypeRequestValidator(signupSchema, "body"),
  signupController
);

usersRouter.patch(
  "/",
  docs.path({
    summary: "Update user",
    description: "Update user data and/or profile picture",
    tags: ["users"],
    security: getSecuritySchemes(),
    requestBody: generateUpdateUserRequestBody(),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The user was updated successfully"),
      ...getErrorResponses(["400", "401", "409", "404", "500"]),
    },
  }),
  authMiddleware,
  profilePictureMiddleware,
  arktypeRequestValidator(updateUserSchema, "body"),
  updateUserController
);

usersRouter.get(
  "/",
  docs.path({
    summary: "Get user",
    description: "Retrieve the authenticated user's data",
    tags: ["users"],
    security: getSecuritySchemes(),
    responses: {
      200: generateJSONResponse(successResponseSchema, "User data retrieved successfully"),
      ...getErrorResponses(["401", "404", "500"]),
    },
  }),
  authMiddleware,
  getUserController
);

usersRouter.delete(
  "/",
  docs.path({
    summary: "Delete user",
    description: "Delete the authenticated user from the database",
    tags: ["users"],
    security: getSecuritySchemes(),
    responses: {
      200: generateJSONResponse(successResponseSchema, "User deleted successfully"),
      ...getErrorResponses(["401", "404", "500"]),
    },
  }),
  authMiddleware,
  deleteUserController
);

usersRouter.post(
  "/vehicles/:id",
  docs.path({
    summary: "Add vehicle",
    description: "Add vehicle to user",
    tags: ["users"],
    security: getSecuritySchemes(),
    parameters: generateRequestParameters(vehicleIdSchema, "path" ,true),
    responses: {
      201: generateJSONResponse(successResponseSchema, "The vehicle was added successfully"),
      ...getErrorResponses(["401", "404", "500"]),
    },
  }),
  authMiddleware,
  arktypeRequestValidator(vehicleIdSchema, "params"),
  addUserVehicleController
);

usersRouter.delete(
  "/vehicles/:id",
  docs.path({
    summary: "Delete vehicle",
    description: "Delete a vehicle from the user's list of vehicles",
    tags: ["users"],
    security: getSecuritySchemes(),
    parameters: generateRequestParameters(vehicleIdSchema, "path" ,true),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The vehicle was deleted successfully"),
      ...getErrorResponses(["400", "404", "500"]),
    },
  }),
  authMiddleware,
  arktypeRequestValidator(vehicleIdSchema, "params"),
  deleteUserVehicleController
);

usersRouter.post(
  "/verify",
  docs.path({
    summary: "Verify email",
    description: "Verify email",
    tags: ["users"],
    parameters: generateRequestParameters(verifyEmailSchema, "query" ,true),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The email was verified successfully"),
      ...getErrorResponses(["400", "410", "404", "500"]),
    },
  }),
  arktypeRequestValidator(verifyEmailSchema, "query"),
  verifyEmailController
);

usersRouter.post(
  "/send-verification-email",
  docs.path({
    summary: "Send verification email",
    description: "Send verification email",
    tags: ["users"],
    requestBody: generateJSONRequestBody(sentVerificationEmailSchema, "The email to send verification email"),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The verification email was sent successfully"),
      ...getErrorResponses(["404", "500"]),
    },
  }),
  arktypeRequestValidator(sentVerificationEmailSchema, "body"),
  sendVerificationEmailController
);

export { usersRouter };
