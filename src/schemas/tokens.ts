import { type } from "arktype";

const tokenSchema = type({
  id: "string.uuid",
  user_id: "string.uuid",
  refresh_token: type.string,
  created_at: type.Date,
  expires_at: type.Date,
  revoked_at: type.Date,
});

export { tokenSchema };
