import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";

const refreshTokenSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  refresh_token: Type.String(),
  created_at: Type.Date(),
  expires_at: Type.Date(),
  revoked_at: Type.Date(),
});

const accessTokenSchema = Type.Object({
  access_token: Type.String(),
});

const accessTokenPayloadSchema = Type.Object({
  userId: userSchema.properties.id,
  email: userSchema.properties.email,
});

const resetTokenPayloadSchema = Type.Object({
  email: userSchema.properties.email,
  type: Type.String(),
});

export { refreshTokenSchema, accessTokenSchema, accessTokenPayloadSchema, resetTokenPayloadSchema };
