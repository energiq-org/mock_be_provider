/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { getPaymentIntentionController, processWebhookController } from "../controllers/payment/index.js";
import { generateJSONResponse, getErrorResponses, getSecuritySchemes } from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { paymentIntentionResponseSchema } from "../schemas/payment.js";
import { authMiddleware } from "../middlewares/auth.js";

const paymentRouter = Router();

paymentRouter.post(
    "/webhook",
    docs.path({
        summary: "Process paymob webhook",
        description: "Endpoint to receive and process webhooks from Paymob payment gateway",
        tags: ["Payment"],
        requestBody: {
            description: "Paymob webhook payload",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            type: { type: "string", example: "TRANSACTION" },
                            obj: {
                                type: "object",
                                properties: {
                                    id: { type: "number" },
                                    success: { type: "boolean" },
                                    amount_cents: { type: "number" },
                                    currency: { type: "string" },
                                    order: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            payment_status: { type: "string" },
                                        },
                                    },
                                    payment_key_claims: {
                                        type: "object",
                                        properties: {
                                            user_id: { type: "number" },
                                            billing_data: {
                                                type: "object",
                                                properties: {
                                                    email: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Webhook processed successfully",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                msg: { type: "string" },
                                webhook_id: { type: "string" },
                                transaction_id: { type: "string", nullable: true },
                            },
                        },
                    },
                },
            },
        },
    }),
    processWebhookController
);

paymentRouter.get("/create", (req, res) => {
    res.status(201).json({ msg: "Payment created successfully" });
});

paymentRouter.get(
    "/intention",
    docs.path({
        summary: "Get payment intention",
        description: "Retrieve the payment intention",
        tags: ["Payment"],
        security: getSecuritySchemes(),
        parameters: [
            {
                name: "amount",
                in: "query",
                required: true,
                schema: {
                    type: "number",
                },
                description: "Payment amount (can be float)",
            },
        ],
        responses: {
            200: generateJSONResponse(paymentIntentionResponseSchema, "Payment intention created successfully"),
            ...getErrorResponses(["400", "401", "404", "500"]),
        },
    }),
    authMiddleware,
    getPaymentIntentionController
);

export { paymentRouter };
