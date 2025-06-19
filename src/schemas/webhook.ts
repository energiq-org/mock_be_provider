import { Type } from "@sinclair/typebox";

const WebhookSchema = Type.Object({
    id: Type.String({
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
      }),
    success: Type.Boolean(),
    content: Type.Object({
        type: Type.String(),
        obj: Type.Object({
            id: Type.Number(),
            success: Type.Boolean(),
            amount_cents: Type.Number(),
            currency: Type.String(),
            order: Type.Object({
                id: Type.Number(),
                merchant_order_id: Type.Union([Type.String(), Type.Null()]),
                amount_cents: Type.Number(),
                paid_amount_cents: Type.Number(),
                payment_status: Type.String(),
            }),
            payment_key_claims: Type.Object({
                user_id: Type.Number(),
                amount_cents: Type.Number(),
                currency: Type.String(),
                order_id: Type.Number(),
                billing_data: Type.Object({
                    first_name: Type.String(),
                    last_name: Type.String(),
                    email: Type.String(),
                    phone_number: Type.String(),
                }),
                integration_id: Type.Number(),
            }),
            created_at: Type.String(),
            is_live: Type.Boolean(),
        }),
    }),
    created_at: Type.String({ format: "date-time" }),
});

// Paymob webhook payload schema for validation
const PaymobWebhookPayloadSchema = Type.Object({
    type: Type.String(),
    obj: Type.Object({
        id: Type.Number(),
        success: Type.Boolean(),
        amount_cents: Type.Number(),
        currency: Type.String(),
        order: Type.Object({
            id: Type.Number(),
            merchant_order_id: Type.Union([Type.String(), Type.Null()]),
            amount_cents: Type.Number(),
            paid_amount_cents: Type.Number(),
            payment_status: Type.String(),
        }),
        payment_key_claims: Type.Object({
            user_id: Type.Number(),
            amount_cents: Type.Number(),
            currency: Type.String(),
            order_id: Type.Number(),
            billing_data: Type.Object({
                first_name: Type.String(),
                last_name: Type.String(),
                email: Type.String(),
                phone_number: Type.String(),
            }),
            integration_id: Type.Number(),
        }),
        created_at: Type.String(),
        is_live: Type.Boolean(),
    }),
});

export { WebhookSchema, PaymobWebhookPayloadSchema };
