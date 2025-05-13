import { Type } from "@sinclair/typebox";
import { codeSchema } from "./verificationCodes.js";

const userSchema = Type.Object({
  id: Type.String(),
  first_name: Type.String(),
  last_name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  phone_number: Type.String({ pattern: "^(?:\\+20[-]?|0)?1[0-9]{9}$" }),
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
  first_name: Type.Optional(userSchema.properties.first_name),
  last_name: Type.Optional(userSchema.properties.last_name),
  email: Type.Optional(userSchema.properties.email),
  password: Type.Optional(userSchema.properties.password),
  phone_number: Type.Optional(userSchema.properties.phone_number),
});

export { userSchema, signupSchema, verifyEmailSchema, updateUserSchema, sentVerificationEmailSchema };
