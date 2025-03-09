import { type } from "arktype";
import { codeSchema } from "./codes.ts";

const userSchema = type({
  id: "string.uuid",
  first_name: type.string,
  last_name: type.string,
  email: "string.email",
  password: type.string,
  phone_number: type.string,
  profile_picture: type.string,
  created_at: type.Date,
});

const signupSchema = userSchema.pick("first_name", "last_name", "email", "password");

const verifyEmailSchema = type({
  email: userSchema.get("email"),
  code: codeSchema.get("code"),
});

const sentVerificationEmailSchema = type({
  email: userSchema.get("email"),
});

const updateUserSchema = type({
  "first_name?": userSchema.get("first_name"),
  "last_name?": userSchema.get("last_name"),
  "email?": userSchema.get("email"),
  "password?": userSchema.get("password"),
  "phone_number?": userSchema.get("phone_number"),
});

console.log(updateUserSchema.toJsonSchema());

export { userSchema, signupSchema, verifyEmailSchema, updateUserSchema, sentVerificationEmailSchema };
