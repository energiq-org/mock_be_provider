/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession
} from "../controllers/sessions/index.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses, generateJSONRequestBody, generateJSONResponse } from "../docs/helpers.js";
import { getSessionsQueryParamsSchema } from "../schemas/controllers/dashboard/dashboard.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { sessionSchema, createSessionSchema, updateSessionSchema } from "../schemas/sessions.js";
import { Type } from "@sinclair/typebox";

const sessionsRouter = Router();

// GET /sessions - Get all sessions
sessionsRouter.get(
    "/",
    docs.path({
        summary: "Get charging sessions",
        description: "Get all charging sessions with optional filtering and pagination",
        tags: ["Sessions"],
        parameters: generateRequestParameters(getSessionsQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: Type.Array(sessionSchema),
                    pagination: Type.Object({
                        page: Type.Number(),
                        limit: Type.Number(),
                        total: Type.Number(),
                        totalPages: Type.Number(),
                    }),
                }),
                "Sessions retrieved successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(getSessionsQueryParamsSchema, "query"),
    getAllSessions
);

// GET /sessions/:id - Get session by ID
sessionsRouter.get(
    "/:id",
    docs.path({
        summary: "Get charging session by ID",
        description: "Get detailed information about a specific charging session",
        tags: ["Sessions"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Session ID"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: sessionSchema,
                }),
                "Session retrieved successfully"
            ),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    getSessionById
);

// POST /sessions - Create new session
sessionsRouter.post(
    "/",
    docs.path({
        summary: "Create charging session",
        description: "Start a new charging session",
        tags: ["Sessions"],
        requestBody: generateJSONRequestBody(createSessionSchema, "Session data to create"),
        responses: {
            201: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: sessionSchema,
                    message: Type.String(),
                }),
                "Session created successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(createSessionSchema, "body"),
    createSession
);

// PUT /sessions/:id - Update session
sessionsRouter.put(
    "/:id",
    docs.path({
        summary: "Update charging session",
        description: "Update an existing charging session",
        tags: ["Sessions"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Session ID"
            }
        ],
        requestBody: generateJSONRequestBody(updateSessionSchema, "Session data to update"),
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: sessionSchema,
                    message: Type.String(),
                }),
                "Session updated successfully"
            ),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    ajvRequestValidator(updateSessionSchema, "body"),
    updateSession
);

// DELETE /sessions/:id - Delete session
sessionsRouter.delete(
    "/:id",
    docs.path({
        summary: "Delete charging session",
        description: "Delete an existing charging session",
        tags: ["Sessions"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Session ID"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({ 
                    success: Type.Boolean(),
                    message: Type.String() 
                }), 
                "Session deleted successfully"
            ),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    deleteSession
);

export { sessionsRouter }; 