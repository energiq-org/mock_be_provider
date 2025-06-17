import { Type } from "@sinclair/typebox";

const OTPTypeEnum = Type.Union([Type.Literal("verification"), Type.Literal("reset_password")]);

const OTPCodeSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  email: Type.String(),
  code: Type.String({
    minLength: 6,
    maxLength: 6,
  }),
  used: Type.Boolean(),
  type: OTPTypeEnum,
  created_at: Type.Date(),
  expires_at: Type.Date(),
});

export { OTPCodeSchema, OTPTypeEnum };
