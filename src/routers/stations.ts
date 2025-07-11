/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getStationsController,
    createStationController,
    updateStationController,
    deleteStationController
} from "../controllers/stations/index.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses, generateJSONRequestBody, generateJSONResponse } from "../docs/helpers.js";
import { getStationsQueryParamsSchema } from "../schemas/controllers/dashboard/dashboard.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { stationSchema, createStationSchema, updateStationSchema } from "../schemas/stations.js";
import { Type } from "@sinclair/typebox";

const stationsRouter = Router();

// GET /stations - Get all stations
stationsRouter.get(
    "/",
    docs.path({
        summary: "Get charging stations",
        description: "Get all charging stations with optional filtering and pagination",
        tags: ["Stations"],
        parameters: generateRequestParameters(getStationsQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    data: Type.Array(stationSchema),
                    total: Type.Number(),
                    limit: Type.Number(),
                    offset: Type.Number(),
                }),
                "Stations retrieved successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(getStationsQueryParamsSchema, "query"),
    getStationsController
);

// POST /stations - Create new station
stationsRouter.post(
    "/",
    docs.path({
        summary: "Create charging station",
        description: "Create a new charging station",
        tags: ["Stations"],
        requestBody: generateJSONRequestBody(createStationSchema, "Station data to create"),
        responses: {
            201: generateJSONResponse(
                Type.Object({
                    msg: Type.String(),
                    data: stationSchema,
                }),
                "Station created successfully"
            ),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(createStationSchema, "body"),
    createStationController
);

// PUT /stations/:id - Update station
stationsRouter.put(
    "/:id",
    docs.path({
        summary: "Update charging station",
        description: "Update an existing charging station",
        tags: ["Stations"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Station ID"
            }
        ],
        requestBody: generateJSONRequestBody(updateStationSchema, "Station data to update"),
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    msg: Type.String(),
                    data: stationSchema,
                }),
                "Station updated successfully"
            ),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    ajvRequestValidator(updateStationSchema, "body"),
    updateStationController
);

// DELETE /stations/:id - Delete station
stationsRouter.delete(
    "/:id",
    docs.path({
        summary: "Delete charging station",
        description: "Delete an existing charging station",
        tags: ["Stations"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Station ID"
            }
        ],
        responses: {
            200: generateJSONResponse(Type.Object({ msg: Type.String() }), "Station deleted successfully"),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    deleteStationController
);

export { stationsRouter }; 