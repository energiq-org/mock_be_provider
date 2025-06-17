import { Type } from "@sinclair/typebox";

const userSchema = Type.Object({
  id: Type.String(),
  first_name: Type.String(),
  last_name: Type.String(),
  email: Type.String(),
  password: Type.String({
    minLength: 8,
    pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$",
    description: "Password must be at least 8 characters long and contain at least one letter and one number",
  }),
  phone_number: Type.String(),
  profile_picture: Type.String(),
  created_at: Type.String(),
});

export { userSchema };
