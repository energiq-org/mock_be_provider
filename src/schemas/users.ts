import { Type } from "@sinclair/typebox";
import { codeSchema } from "./verificationCodes.js";

const userSchema = Type.Object({
  id: Type.String(),
  first_name: Type.String(),
  last_name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  phone_number: Type.String(),
  profile_picture: Type.String(),
  created_at: Type.String(),
});

const signupSchema = Type.Pick(userSchema, ["first_name", "last_name", "email", "password"]);

const verifyEmailSchema = Type.Object({
  email: userSchema.properties.email,
  code: codeSchema.properties.code,
});

const sentVerificationEmailSchema = Type.Object({
  email: userSchema.properties.email,
});

const updateUserSchema = Type.Object({
  first_name: userSchema.properties.first_name,
  last_name: userSchema.properties.last_name,
  email: userSchema.properties.email,
  password: userSchema.properties.password,
  phone_number: userSchema.properties.phone_number,
});

export { userSchema, signupSchema, verifyEmailSchema, updateUserSchema, sentVerificationEmailSchema };
