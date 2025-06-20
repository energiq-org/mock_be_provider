import { Type } from "@sinclair/typebox";

const userSchema = Type.Object({
    id: Type.String({
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
    }),
    first_name: Type.String({ minLength: 3, maxLength: 255 }),
    last_name: Type.String({ minLength: 3, maxLength: 255 }),
    email: Type.String({
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description: "Email address",
    }),
    password: Type.String({
        pattern: "/^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,}$/",
        description:
            "Password must be at least 8 characters long and contain at least one letter and one number and one special character",
    }),
    email_verified: Type.Boolean(),
    phone_number: Type.String({
        pattern: "^(?:\\+20[-]?|0)?1[0-9]{9}$",
        description: "Phone number (e.g., +201012345678)",
    }),
    profile_picture: Type.String(),
    created_at: Type.String({ format: "date-time" }),
});

export { userSchema };
