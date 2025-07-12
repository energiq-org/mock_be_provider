/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getAllSessions, exportSessionsCSV
} from "../controllers/sessions/index.js";
import { docs } from "../docs/index.js";
import { getErrorResponses, generateJSONResponse } from "../docs/helpers.js";
import { sessionSchema } from "../schemas/sessions.js";
import { Type } from "@sinclair/typebox";

const sessionsRouter = Router();

sessionsRouter.get(
    "/",
    docs.path({
        summary: "Get charging sessions",
        description: "Get all charging sessions in descending order (latest first), limited to 100 results",
        tags: ["Sessions"],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    success: Type.Boolean(),
                    data: Type.Array(sessionSchema),
                    total: Type.Number(),
                }),
                "Sessions retrieved successfully"
            ),
            ...getErrorResponses(["500"]),
        },
    }),
    getAllSessions
);

// sessionsRouter.get(
//     "/:id",
//     docs.path({
//         summary: "Get charging session by ID",
//         description: "Get detailed information about a specific charging session",
//         tags: ["Sessions"],
//         parameters: [
//             {
//                 in: "path",
//                 name: "id",
//                 required: true,
//                 schema: { type: "number" },
//                 description: "Session ID"
//             }
//         ],
//         responses: {
//             200: generateJSONResponse(
//                 Type.Object({
//                     success: Type.Boolean(),
//                     data: sessionSchema,
//                 }),
//                 "Session retrieved successfully"
//             ),
//             ...getErrorResponses(["404", "500"]),
//         },
//     }),
//     getSessionById
// );

// sessionsRouter.post(
//     "/",
//     docs.path({
//         summary: "Create charging session",
//         description: "Start a new charging session",
//         tags: ["Sessions"],
//         requestBody: generateJSONRequestBody(createSessionSchema, "Session data to create"),
//         responses: {
//             201: generateJSONResponse(
//                 Type.Object({
//                     success: Type.Boolean(),
//                     data: sessionSchema,
//                     message: Type.String(),
//                 }),
//                 "Session created successfully"
//             ),
//             ...getErrorResponses(["400", "500"]),
//         },
//     }),
//     ajvRequestValidator(createSessionSchema, "body"),
//     createSession
// );

// sessionsRouter.put(
//     "/:id",
//     docs.path({
//         summary: "Update charging session",
//         description: "Update an existing charging session",
//         tags: ["Sessions"],
//         parameters: [
//             {
//                 in: "path",
//                 name: "id",
//                 required: true,
//                 schema: { type: "number" },
//                 description: "Session ID"
//             }
//         ],
//         requestBody: generateJSONRequestBody(updateSessionSchema, "Session data to update"),
//         responses: {
//             200: generateJSONResponse(
//                 Type.Object({
//                     success: Type.Boolean(),
//                     data: sessionSchema,
//                     message: Type.String(),
//                 }),
//                 "Session updated successfully"
//             ),
//             ...getErrorResponses(["400", "404", "500"]),
//         },
//     }),
//     ajvRequestValidator(updateSessionSchema, "body"),
//     updateSession
// );

// sessionsRouter.delete(
//     "/:id",
//     docs.path({
//         summary: "Delete charging session",
//         description: "Delete an existing charging session",
//         tags: ["Sessions"],
//         parameters: [
//             {
//                 in: "path",
//                 name: "id",
//                 required: true,
//                 schema: { type: "number" },
//                 description: "Session ID"
//             }
//         ],
//         responses: {
//             200: generateJSONResponse(
//                 Type.Object({ 
//                     success: Type.Boolean(),
//                     message: Type.String() 
//                 }), 
//                 "Session deleted successfully"
//             ),
//             ...getErrorResponses(["400", "404", "500"]),
//         },
//     }),
//     deleteSession
// );

sessionsRouter.get(
    "/export/csv",
    docs.path({
        summary: "Export sessions as CSV",
        description: "Export all sessions to CSV format in descending order (latest first), limited to 100 results",
        tags: ["Sessions"],
        responses: {
            200: {
                description: "CSV file downloaded successfully",
                content: {
                    "text/csv": {
                        schema: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            },
            ...getErrorResponses(["500"]),
        },
    }),
    exportSessionsCSV
);

export { sessionsRouter }; 