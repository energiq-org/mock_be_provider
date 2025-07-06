import { Type } from "@sinclair/typebox";
import { authUserSchema } from "./authUser.js";

// Signup specific enums
export enum SignupErrorCode {
    EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

// Request schema
export const signupSchema = Type.Pick(authUserSchema, ["first_name", "last_name", "email", "password"]);

// Response schemas
export const signupSuccessResponseSchema = Type.Object({
    userId: Type.String({ format: "uuid" }),
});

export const signupErrorResponseSchema = Type.Object({
    code: Type.Enum(SignupErrorCode),
    message: Type.String(),
});
