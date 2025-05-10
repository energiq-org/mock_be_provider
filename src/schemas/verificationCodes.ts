import { Type } from "@sinclair/typebox";

const codeSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  code: Type.String(),
  used: Type.Boolean(),
  created_at: Type.Date(),
  expires_at: Type.Date(),
});

export { codeSchema };
