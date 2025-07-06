import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";

const accessTokenPayloadSchema = Type.Object({
    user: Type.Pick(userSchema, [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "created_at",
        "email_verified",
    ]),
});

export { accessTokenPayloadSchema };
