import { Type } from "@sinclair/typebox";
import { authUserSchema } from "./authUser.js";

// Get user specific enums
export enum GetUserErrorCode {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

// Path parameter schema
export const getUserParamsSchema = Type.Object({
    userId: Type.String(),
});

// Success response schema - returns user data directly (no code/message wrapper)
export const getUserSuccessResponseSchema = Type.Object({
    id: authUserSchema.properties.id,
    first_name: authUserSchema.properties.first_name,
    last_name: authUserSchema.properties.last_name,
    email: authUserSchema.properties.email,
    phone_number: Type.Optional(authUserSchema.properties.phone_number),
    created_at: authUserSchema.properties.created_at,
});

// Error response schema - uses code/message format
export const getUserErrorResponseSchema = Type.Object({
    code: Type.Enum(GetUserErrorCode),
    message: Type.String(),
});
