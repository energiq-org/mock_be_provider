import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";

/* eslint-disable no-unused-vars */
enum OTPType {
  VERIFICATION = "verification",
  RESET_PASSWORD = "reset_password",
}

const OTPCodeSchema = Type.Object({
  id: Type.String({
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
  }),
  user_id: userSchema.properties.id,
  email: userSchema.properties.email,
  code: Type.String({
    pattern: "^[0-9]{6}$",
    description: "exactly 6 digits",
  }),
  used: Type.Boolean(),
  type: Type.Union([Type.Literal(OTPType.VERIFICATION), Type.Literal(OTPType.RESET_PASSWORD)]),
  created_at: Type.String({ format: "date-time" }),
  expires_at: Type.String({ format: "date-time" }),
});

export { OTPCodeSchema, OTPType };
