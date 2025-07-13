/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import { getPaymentIntentionController, createSessionWithPaymentController } from "../controllers/payment/index.js";
import { docs } from "../docs/index.js";
import { getErrorResponses, generateJSONResponse, generateJSONRequestBody } from "../docs/helpers.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { Type } from "@sinclair/typebox";

const paymentRouter = Router();

// Schema for creating a session with payment
const createSessionWithPaymentSchema = Type.Object({
    user_id: Type.Optional(Type.String()),
    charger_id: Type.Optional(Type.String()),
    connector_id: Type.Optional(Type.String()),
    energy_delivered: Type.Optional(Type.Number()),
    cost: Type.Number(),
    duration_minutes: Type.Optional(Type.Number()),
    peak_power: Type.Optional(Type.Number()),
    average_power: Type.Optional(Type.Number()),
});

// GET /payment/intention - Get payment intention URL
paymentRouter.get(
    "/intention",
    docs.path({
        summary: "Get payment intention URL",
        description: "Get a payment intention URL for a specific amount",
        tags: ["Payment"],
        parameters: [
            {
                in: "query",
                name: "amount",
                required: true,
                schema: { type: "number" },
                description: "Payment amount in EGP"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    intention_url: Type.String(),
                }),
                "Payment intention URL retrieved successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    getPaymentIntentionController
);

// POST /payment/create-session - Create session with payment
paymentRouter.post(
    "/create-session",
    docs.path({
        summary: "Create charging session with payment",
        description: "Create a new charging session, select a random station, and initiate payment",
        tags: ["Payment"],
        requestBody: generateJSONRequestBody(createSessionWithPaymentSchema, "Session and payment data"),
        responses: {
            201: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    session_id: Type.Number(),
                    payment_url: Type.String(),
                    message: Type.String(),
                }),
                "Session created and payment initiated successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(createSessionWithPaymentSchema, "body"),
    createSessionWithPaymentController
);

export { paymentRouter }; 