import { Type } from "@sinclair/typebox";

const WebhookSchema = Type.Object({
    id: Type.String({
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
      }),
    success: Type.Boolean(),
    content: Type.Object({
        type: Type.String(),
        data: Type.Object({
            id: Type.String(),
        }),
    }),
    created_at: Type.String({ format: "date-time" }),
});

export { WebhookSchema };
