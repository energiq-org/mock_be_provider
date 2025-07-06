import { Type } from "@sinclair/typebox";
import { authUserSchema } from "../utils/external/be_auth/schemas/authUser.js";

const localUserSchema = Type.Object({
    id: Type.String({
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
    }),
    profile_picture: Type.String(),
    created_at: Type.String(),
});

const userSchema = Type.Composite([authUserSchema, localUserSchema]);

export { userSchema, localUserSchema };
