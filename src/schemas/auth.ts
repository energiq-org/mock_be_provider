import { Type } from "@sinclair/typebox";
import { tokenSchema } from "./tokens.js";
import { userSchema } from "./users.js";

const accessTokenPayloadSchema = Type.Object({
  userId: userSchema.properties.id,
  email: userSchema.properties.email,
});

const loginSchema = Type.Pick(userSchema, ["email", "password"]);
const refreshSchema = Type.Object({
  token: tokenSchema.properties.refresh_token,
});
const logoutSchema = Type.Pick(tokenSchema, ["refresh_token"]);

const accessTokenSchema = Type.Object({
  access_token: Type.String(),
});

// Response schemas
const loginResponseSchema = Type.Object({
  access_token: accessTokenSchema.properties.access_token,
  refresh_token: tokenSchema.properties.refresh_token,
});

const refreshResponseSchema = Type.Object({
  access_token: accessTokenSchema.properties.access_token,
});

export {
  accessTokenPayloadSchema,
  loginResponseSchema,
  loginSchema,
  logoutSchema,
  refreshResponseSchema,
  refreshSchema,
};
