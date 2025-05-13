import { OTPCodeSchema } from "../../OTP.js";
import { userSchema } from "../../users.js";
import { Type } from "@sinclair/typebox";

const verifyEmailSchema = Type.Object({
  email: userSchema.properties.email,
  code: OTPCodeSchema.properties.code,
});

const sentVerificationEmailSchema = Type.Object({
  email: userSchema.properties.email,
});

export { verifyEmailSchema, sentVerificationEmailSchema };
