/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
    signupController,
    updateUserController,
    getUserController,
    deleteUserController,
    updateUserPasswordController,
    getUserVehiclesController,
} from "../controllers/users/index.js";
import { sendVerificationEmailController, verifyEmailController } from "../controllers/users/mail.js";
import {
    addUserVehicleController,
    deleteUserVehicleController,
    updateUserVehicleController,
} from "../controllers/users/userVehicles.js";
import {
    generateJSONRequestBody,
    generateJSONResponse,
    getErrorResponses,
    getSecuritySchemes,
    generateUpdateUserRequestBody,
    generateRequestParameters,
} from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { authMiddleware } from "../middlewares/auth.js";
import { profilePictureMiddleware } from "../middlewares/multer.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { successResponseSchema } from "../schemas/common-responses.js";
import { vehicleIdSchema } from "../schemas/userVehicles.js";
import { addUserVehicleSchema, updateUserVehicleSchema } from "../schemas/controllers/users/userVehicles.js";
import {
    signupSchema,
    updateUserSchema,
    updateUserPasswordSchema,
    getUserSchema,
} from "../schemas/controllers/users/user.js";
import { verifyEmailSchema, sentVerificationEmailSchema } from "../schemas/controllers/users/mail.js";
import { getUserVehiclesResponseSchema } from "../schemas/controllers/users/userVehicles.js";

const usersRouter = Router();

usersRouter.post(
    "/signup",
    docs.path({
        summary: "Signup",
        description: "Signup for a new user",
        tags: ["Users"],
        requestBody: generateJSONRequestBody(signupSchema, "The user to signup"),
        responses: {
            201: generateJSONResponse(successResponseSchema, "The user was created successfully"),
            ...getErrorResponses(["409", "500"]),
        },
    }),
    ajvRequestValidator(signupSchema, "body"),
    signupController
);

usersRouter.patch(
    "",
    docs.path({
        summary: "Update user",
        description: "Update user data and/or profile picture",
        tags: ["Users"],
        security: getSecuritySchemes(),
        requestBody: generateUpdateUserRequestBody(),
        responses: {
            200: generateJSONResponse(successResponseSchema, "The user was updated successfully"),
            ...getErrorResponses(["400", "401", "409", "404", "500"]),
        },
    }),
    authMiddleware,
    profilePictureMiddleware,
    ajvRequestValidator(updateUserSchema, "body"),
    updateUserController
);

usersRouter.patch(
    "/password",
    docs.path({
        summary: "Update user password",
        description: "Update user password",
        tags: ["Users"],
        security: getSecuritySchemes(),
        requestBody: generateJSONRequestBody(updateUserPasswordSchema, "The user's new password"),
        responses: {
            200: generateJSONResponse(successResponseSchema, "The user's password was updated successfully"),
            ...getErrorResponses(["400", "401", "404", "500"]),
        },
    }),
    authMiddleware,
    ajvRequestValidator(updateUserPasswordSchema, "body"),
    updateUserPasswordController
);
usersRouter.get(
    "",
    docs.path({
        summary: "Get user",
        description: "Retrieve the authenticated user's data",
        tags: ["Users"],
        security: getSecuritySchemes(),
        responses: {
            200: generateJSONResponse(getUserSchema, "User data retrieved successfully"),
            ...getErrorResponses(["401", "404", "500"]),
        },
    }),
    authMiddleware,
    getUserController
);

usersRouter.delete(
    "",
    docs.path({
        summary: "Delete user",
        description: "Delete the authenticated user from the database",
        tags: ["Users"],
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
    "/vehicles",
    docs.path({
        summary: "Add vehicle",
        description: "Add vehicle to user",
        tags: ["Users - Vehicles"],
        security: getSecuritySchemes(),
        requestBody: generateJSONRequestBody(addUserVehicleSchema, "The vehicle to add"),
        responses: {
            201: generateJSONResponse(successResponseSchema, "The vehicle was added successfully"),
            ...getErrorResponses(["401", "404", "500"]),
        },
    }),
    authMiddleware,
    ajvRequestValidator(addUserVehicleSchema, "body"),
    addUserVehicleController
);

usersRouter.delete(
    "/vehicles/:id",
    docs.path({
        summary: "Delete vehicle",
        description: "Delete a vehicle from the user's list of vehicles",
        tags: ["Users - Vehicles"],
        security: getSecuritySchemes(),
        parameters: generateRequestParameters(vehicleIdSchema, "path", true),
        responses: {
            200: generateJSONResponse(successResponseSchema, "The vehicle was deleted successfully"),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    authMiddleware,
    ajvRequestValidator(vehicleIdSchema, "params"),
    deleteUserVehicleController
);
usersRouter.patch(
    "/vehicles/:id",
    docs.path({
        summary: "Update vehicle",
        description: "Update a vehicle from the user's list of vehicles",
        tags: ["Users - Vehicles"],
        security: getSecuritySchemes(),
        parameters: generateRequestParameters(vehicleIdSchema, "path", true),
        requestBody: generateJSONRequestBody(updateUserVehicleSchema, "The vehicle to update"),
        responses: {
            200: generateJSONResponse(successResponseSchema, "The vehicle was updated successfully"),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    authMiddleware,
    ajvRequestValidator(updateUserVehicleSchema, "body"),
    updateUserVehicleController
);

usersRouter.post(
    "/verify",
    docs.path({
        summary: "Verify email",
        description: "Verify email",
        tags: ["Users - Verification"],
        parameters: generateRequestParameters(verifyEmailSchema, "query", true),
        responses: {
            200: generateJSONResponse(successResponseSchema, "The email was verified successfully"),
            ...getErrorResponses(["400", "410", "404", "500"]),
        },
    }),
    ajvRequestValidator(verifyEmailSchema, "query"),
    verifyEmailController
);

usersRouter.post(
    "/send-verification-email",
    docs.path({
        summary: "Send verification email",
        description: "Send verification email",
        tags: ["Users - Verification"],
        requestBody: generateJSONRequestBody(sentVerificationEmailSchema, "The email to send verification email"),
        responses: {
            200: generateJSONResponse(successResponseSchema, "The verification email was sent successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    ajvRequestValidator(sentVerificationEmailSchema, "body"),
    sendVerificationEmailController
);

usersRouter.get(
    "/vehicles",
    docs.path({
        summary: "Get user vehicles",
        description: "Retrieve the authenticated user's vehicles",
        tags: ["Users - Vehicles"],
        security: getSecuritySchemes(),
        responses: {
            200: generateJSONResponse(getUserVehiclesResponseSchema, "User vehicles retrieved successfully"),
            ...getErrorResponses(["401", "404", "500"]),
        },
    }),
    authMiddleware,
    getUserVehiclesController
);

export { usersRouter };
