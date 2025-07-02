/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
    processWebhookController,
    getPaymentIntentionController,
    downloadReceiptController,
} from "../controllers/payment/index.js";
import {
    generateJSONRequestBody,
    generateJSONResponse,
    generateRequestParameters,
    getErrorResponses,
    getSecuritySchemes,
} from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { PaymobWebhookPayloadSchema } from "../schemas/webhook.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import {
    paymentIntentionRequestSchema,
    paymentIntentionResponseSchema,
    receiptDownloadRequestSchema,
} from "../schemas/payment.js";
import { authMiddleware } from "../middlewares/auth.js";

const paymentRouter = Router();

paymentRouter.post(
    "/webhook",
    docs.path({
        summary: "Process paymob webhook",
        description: "Endpoint to receive and process webhooks from Paymob payment gateway",
        tags: ["Payment"],
        requestBody: generateJSONRequestBody(PaymobWebhookPayloadSchema, "Paymob webhook payload"),
    }),
    ajvRequestValidator(PaymobWebhookPayloadSchema, "body"),
    processWebhookController
);

paymentRouter.get(
    "/intention",
    docs.path({
        summary: "Get payment intention",
        description: "Retrieve the payment intention",
        tags: ["Payment"],
        security: getSecuritySchemes(),
        parameters: generateRequestParameters(paymentIntentionRequestSchema, "query"),
        responses: {
            200: generateJSONResponse(paymentIntentionResponseSchema, "Payment intention created successfully"),
            ...getErrorResponses(["400", "401", "404", "500"]),
        },
    }),
    authMiddleware,
    ajvRequestValidator(paymentIntentionRequestSchema, "query"),
    getPaymentIntentionController
);

paymentRouter.post(
    "/receipt/download",
    docs.path({
        summary: "Download payment receipt as PDF",
        description: "Generate and download a payment receipt PDF based on provided session details.",
        tags: ["Payment"],
        security: getSecuritySchemes(),
        requestBody: generateJSONRequestBody(receiptDownloadRequestSchema, "Receipt details for PDF generation"),
        responses: {
            200: {
                description: "PDF receipt generated successfully",
                content: {
                    "application/pdf": {
                        schema: { type: "string", format: "binary" },
                    },
                },
            },
            ...getErrorResponses(["400", "500"]),
        },
    }),
    authMiddleware,
    ajvRequestValidator(receiptDownloadRequestSchema, "body"),
    downloadReceiptController
);

export { paymentRouter };
