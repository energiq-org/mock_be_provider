/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getAllAlerts,
    getAlertById,
    createAlert,
    acknowledgeAlert,
    dismissResolvedAlerts,
    deleteAlert
} from "../controllers/alerts/index.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses, generateJSONRequestBody, generateJSONResponse } from "../docs/helpers.js";
import { getAlertsQueryParamsSchema } from "../schemas/controllers/dashboard/dashboard.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { alertSchema, createAlertSchema, acknowledgeAlertSchema } from "../schemas/alerts.js";
import { Type } from "@sinclair/typebox";

const router = Router();

// GET /alerts - Get all alerts
router.get(
    "/",
    docs.path({
        summary: "Get system alerts",
        description: "Get all system alerts with optional filtering and pagination",
        tags: ["Alerts"],
        parameters: generateRequestParameters(getAlertsQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: Type.Array(alertSchema),
                    pagination: Type.Object({
                        page: Type.Number(),
                        limit: Type.Number(),
                        total: Type.Number(),
                        totalPages: Type.Number(),
                    }),
                }),
                "Alerts retrieved successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(getAlertsQueryParamsSchema, "query"),
    getAllAlerts
);

// GET /alerts/:id - Get alert by ID
router.get(
    "/:id",
    docs.path({
        summary: "Get alert by ID",
        description: "Get detailed information about a specific alert",
        tags: ["Alerts"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Alert ID"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: alertSchema,
                }),
                "Alert retrieved successfully"
            ),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    getAlertById
);

// POST /alerts - Create new alert
router.post(
    "/",
    docs.path({
        summary: "Create system alert",
        description: "Create a new system alert",
        tags: ["Alerts"],
        requestBody: generateJSONRequestBody(createAlertSchema, "Alert data to create"),
        responses: {
            201: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: alertSchema,
                    message: Type.String(),
                }),
                "Alert created successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(createAlertSchema, "body"),
    createAlert
);

// PUT /alerts/:id/acknowledge - Acknowledge alert
router.put(
    "/:id/acknowledge",
    docs.path({
        summary: "Acknowledge alert",
        description: "Acknowledge an active alert",
        tags: ["Alerts"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Alert ID"
            }
        ],
        requestBody: generateJSONRequestBody(acknowledgeAlertSchema, "Acknowledgment data"),
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: alertSchema,
                    message: Type.String(),
                }),
                "Alert acknowledged successfully"
            ),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    ajvRequestValidator(acknowledgeAlertSchema, "body"),
    acknowledgeAlert
);

// POST /alerts/dismiss-resolved - Dismiss resolved alerts
router.post(
    "/dismiss-resolved",
    docs.path({
        summary: "Dismiss resolved alerts",
        description: "Mark all resolved alerts as dismissed",
        tags: ["Alerts"],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    message: Type.String(),
                }),
                "Resolved alerts dismissed successfully"
            ),
            ...getErrorResponses(["500"]),
        },
    }),
    dismissResolvedAlerts
);

// DELETE /alerts/:id - Delete alert
router.delete(
    "/:id",
    docs.path({
        summary: "Delete system alert",
        description: "Delete an existing system alert",
        tags: ["Alerts"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Alert ID"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({ 
                    success: Type.Boolean(),
                    message: Type.String() 
                }), 
                "Alert deleted successfully"
            ),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    deleteAlert
);

export { router as alertsRouter }; 