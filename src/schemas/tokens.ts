import { Type } from "@sinclair/typebox";

const tokenSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  refresh_token: Type.String(),
  created_at: Type.Date(),
  expires_at: Type.Date(),
  revoked_at: Type.Date(),
});

export { tokenSchema };
