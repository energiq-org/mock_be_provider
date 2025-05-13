import { Type } from "@sinclair/typebox";

const userSchema = Type.Object({
  id: Type.String(),
  first_name: Type.String(),
  last_name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  phone_number: Type.String(),
  profile_picture: Type.String(),
  created_at: Type.String(),
});

export { userSchema };
