/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { loginController } from "../controllers/auth/login.js";
import { logoutController } from "../controllers/auth/logout.js";
import { refreshTokenController } from "../controllers/auth/refresh.js";
import {
    forgetPasswordController,
    verifyPasswordResetOTPController,
    resetPasswordController,
} from "../controllers/auth/resetPassword.js";
import { generateJSONRequestBody, generateJSONResponse, getErrorResponses } from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import {
    loginResponseSchema,
    loginSchema,
    logoutSchema,
    refreshResponseSchema,
    refreshSchema,
    forgetPasswordSchema,
    verifyPasswordResetOTPSchema,
    resetPasswordSchema,
    verifyPasswordResetOTPResponseSchema,
} from "../schemas/controllers/auth/auth.js";
import { successResponseSchema } from "../schemas/common-responses.js";

const authRouter: Router = Router();

authRouter.post(
    "/login",
    docs.path({
        tags: ["Auth"],
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
        tags: ["Auth"],
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
        tags: ["Auth"],
        summary: "Logout",
        description: "Logout user",
        requestBody: generateJSONRequestBody(logoutSchema, "Logout request body"),
        responses: {
            "200": generateJSONResponse(successResponseSchema, "Logout successful"),
            ...getErrorResponses(["400","401", "404", "500"]),
        },
    }),
    ajvRequestValidator(logoutSchema, "body"),
    logoutController
);

authRouter.post(
    "/forget-password",
    docs.path({
        tags: ["Auth"],
        summary: "Forget password",
        description: "Forget password",
        requestBody: generateJSONRequestBody(forgetPasswordSchema, "Forget password request body"),
        responses: {
            "200": generateJSONResponse(successResponseSchema, "Forget password request successful"),
            ...getErrorResponses(["400","401", "404", "500"]),
        },
    }),
    ajvRequestValidator(forgetPasswordSchema, "body"),
    forgetPasswordController
);

authRouter.post(
    "/verify-password-reset-otp",
    docs.path({
        tags: ["Auth"],
        summary: "Verify password reset OTP",
        description: "Verify password reset OTP",
        requestBody: generateJSONRequestBody(verifyPasswordResetOTPSchema, "Verify password reset OTP request body"),
        responses: {
            "200": generateJSONResponse(
                verifyPasswordResetOTPResponseSchema,
                "Verify password reset OTP request successful"
            ),
            ...getErrorResponses(["400","401", "404", "500"]),
        },
    }),
    ajvRequestValidator(verifyPasswordResetOTPSchema, "body"),
    verifyPasswordResetOTPController
);

authRouter.post(
    "/reset-password",
    docs.path({
        tags: ["Auth"],
        summary: "Reset password",
        description: "Reset password",
        requestBody: generateJSONRequestBody(resetPasswordSchema, "Reset password request body"),
        responses: {
            "200": generateJSONResponse(successResponseSchema, "Reset password request successful"),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    ajvRequestValidator(resetPasswordSchema, "body"),
    resetPasswordController
);

export { authRouter };
