import { type } from "arktype";
import { codeSchema } from "./codes.js";

const userSchema = type({
  id: "string.uuid",
  first_name: type.string,
  last_name: type.string,
  email: "string.email",
  password: "string >=8",
  phone_number: /^(?:\+20[-]?|0)?1[0-9]{9}$/,
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

export { userSchema, signupSchema, verifyEmailSchema, updateUserSchema, sentVerificationEmailSchema };
