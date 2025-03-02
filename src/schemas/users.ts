import { type } from "arktype";

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

export { userSchema };
