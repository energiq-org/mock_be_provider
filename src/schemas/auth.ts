import { type } from "arktype";
import { tokenSchema } from "./tokens.ts";
import { userSchema } from "./users.ts";

const loginSchema = userSchema.pick("email", "password");
const refreshSchema = type({
  token: tokenSchema.get("refresh_token"),
});
const logoutSchema = tokenSchema.pick("refresh_token");

export { loginSchema, logoutSchema, refreshSchema };
