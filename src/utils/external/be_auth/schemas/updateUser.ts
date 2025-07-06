import { Type } from "@sinclair/typebox";
import { authUserSchema } from "./authUser.js";

// Update user specific enums
export enum UpdateUserSuccessCode {
    UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS",
}

export enum UpdateUserErrorCode {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    NO_DATA_TO_UPDATE = "NO_DATA_TO_UPDATE",
    EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
    SAME_EMAIL_PROVIDED = "SAME_EMAIL_PROVIDED",
    PHONE_NUMBER_ALREADY_EXISTS = "PHONE_NUMBER_ALREADY_EXISTS",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export const updateUserParamsSchema = Type.Object({
    userId: Type.String(),
});

// Request schema
export const updateUserSchema = Type.Object({
    first_name: Type.Optional(authUserSchema.properties.first_name),
    last_name: Type.Optional(authUserSchema.properties.last_name),
    email: Type.Optional(authUserSchema.properties.email),
    phone_number: Type.Optional(authUserSchema.properties.phone_number),
});

// Response schemas
export const updateUserSuccessResponseSchema = Type.Object({
    code: Type.Enum(UpdateUserSuccessCode),
    message: Type.String(),
});

export const updateUserErrorResponseSchema = Type.Object({
    code: Type.Enum(UpdateUserErrorCode),
    message: Type.String(),
});
