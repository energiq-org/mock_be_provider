import { type } from "arktype";
import { tokenSchema } from "./tokens.ts";
import { userSchema } from "./users.ts";

const accessTokenPayloadSchema = type({
  userId: userSchema.get("id"),
  email: userSchema.get("email"),
});

const loginSchema = userSchema.pick("email", "password");
const refreshSchema = type({
  token: tokenSchema.get("refresh_token"),
});
const logoutSchema = tokenSchema.pick("refresh_token");

const accessTokenSchema = type({
  access_token: "string",
});

// Response schemas
const loginResponseSchema = type({
  access_token: accessTokenSchema.get("access_token"),
  refresh_token: tokenSchema.get("refresh_token"),
});

const refreshResponseSchema = type({
  access_token: accessTokenSchema.get("access_token"),
});

export {
  accessTokenPayloadSchema,
  loginResponseSchema,
  loginSchema,
  logoutSchema,
  refreshResponseSchema,
  refreshSchema,
};
