import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";
import { OTPType } from "./OTP.js";

const refreshTokenSchema = Type.Object({
  id: Type.String({
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
  }),
  user_id: userSchema.properties.id,
  refresh_token: Type.String({
    minLength: 128,
    maxLength: 128,
    pattern: "^[0-9a-f]{128}$",
    description: "Refresh token (128 hexadecimal characters)",
  }),
  created_at: Type.String({ format: "date-time" }),
  expires_at: Type.String({ format: "date-time" }),
  revoked_at: Type.String({ format: "date-time" }),
});

const accessTokenSchema = Type.Object({
  access_token: Type.String({ description: "Access token" }),
});

const accessTokenPayloadSchema = Type.Object({
  userId: userSchema.properties.id,
  email: userSchema.properties.email,
});

const resetPasswordTokenPayloadSchema = Type.Object({
  email: userSchema.properties.email,
  type: Type.Literal(OTPType.RESET_PASSWORD),
});

export { refreshTokenSchema, accessTokenSchema, accessTokenPayloadSchema, resetPasswordTokenPayloadSchema };
