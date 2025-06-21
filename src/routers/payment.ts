/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { processWebhookController } from "../controllers/payment/index.js";
import {
    generateJSONRequestBody
} from "../docs/helpers.js";
import { docs } from "../docs/index.js";
import { PaymobWebhookPayloadSchema } from "../schemas/webhook.js";
import { ajvRequestValidator } from "../middlewares/validator.js";

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

export { paymentRouter };
