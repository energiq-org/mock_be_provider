import { type } from "arktype";

const codeSchema = type({
  id: "string.uuid",
  email: type.string,
  code: type.string,
  used: type.boolean,
  created_at: type.Date,
  expires_at: type.Date,
});

export { codeSchema };
