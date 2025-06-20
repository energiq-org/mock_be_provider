import { Type } from "@sinclair/typebox";


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

export { PaymobWebhookPayloadSchema };
