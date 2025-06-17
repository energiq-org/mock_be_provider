import { Type } from "@sinclair/typebox";
import { refreshTokenSchema, accessTokenSchema } from "../../token.js";
import { userSchema } from "../../users.js";
import { OTPCodeSchema } from "../../OTP.js";

const loginSchema = Type.Pick(userSchema, ["email", "password"]);

const refreshSchema = Type.Object({
  token: refreshTokenSchema.properties.refresh_token,
});
const logoutSchema = Type.Pick(refreshTokenSchema, ["refresh_token"]);

const forgetPasswordSchema = Type.Object({
  email: userSchema.properties.email,
});

const verifyPasswordResetOTPSchema = Type.Object({
  email: userSchema.properties.email,
  code: OTPCodeSchema.properties.code,
});

const resetPasswordSchema = Type.Object({
  token: Type.String(),
  new_password: userSchema.properties.password,
});

// Response schemas
const loginResponseSchema = Type.Object({
  access_token: accessTokenSchema.properties.access_token,
  refresh_token: refreshTokenSchema.properties.refresh_token,
});

const refreshResponseSchema = Type.Object({
  access_token: accessTokenSchema.properties.access_token,
});

export {
  loginResponseSchema,
  refreshResponseSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  forgetPasswordSchema,
  verifyPasswordResetOTPSchema,
  resetPasswordSchema,
};
