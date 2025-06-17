import { Type } from "@sinclair/typebox";

const OTPCodeSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  code: Type.String({
    minLength: 6,
    maxLength: 6,
  }),
  used: Type.Boolean(),
  created_at: Type.Date(),
  expires_at: Type.Date(),
});

export { OTPCodeSchema };
