/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getVehiclesController,
    createVehicleController,
    updateVehicleController,
    deleteVehicleController
} from "../controllers/vehicles/index.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses, generateJSONRequestBody, generateJSONResponse } from "../docs/helpers.js";
import { getVehiclesQueryParamsSchema } from "../schemas/controllers/vehicles/vehicles.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { vehicleSchema, createVehicleSchema, updateVehicleSchema } from "../schemas/vehicles.js";
import { Type } from "@sinclair/typebox";

const vehiclesRouter = Router();

// GET /vehicles
vehiclesRouter.get(
    "/",
    docs.path({
        summary: "Get vehicles",
        description: "Get all vehicles or filter by ID or model",
        tags: ["Vehicles"],
        parameters: generateRequestParameters(getVehiclesQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(Type.Array(vehicleSchema), "Vehicles retrieved successfully"),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(getVehiclesQueryParamsSchema, "query"),
    getVehiclesController
);

// POST /vehicles
vehiclesRouter.post(
    "/",
    docs.path({
        summary: "Create vehicle",
        description: "Create a new vehicle",
        tags: ["Vehicles"],
        requestBody: generateJSONRequestBody(createVehicleSchema, "Vehicle data to create"),
        responses: {
            201: generateJSONResponse(vehicleSchema, "Vehicle created successfully"),
            ...getErrorResponses(["400", "500"]),
        },
    }),
    ajvRequestValidator(createVehicleSchema, "body"),
    createVehicleController
);

// PUT /vehicles/:id
vehiclesRouter.put(
    "/:id",
    docs.path({
        summary: "Update vehicle",
        description: "Update an existing vehicle",
        tags: ["Vehicles"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Vehicle ID"
            }
        ],
        requestBody: generateJSONRequestBody(updateVehicleSchema, "Vehicle data to update"),
        responses: {
            200: generateJSONResponse(vehicleSchema, "Vehicle updated successfully"),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    ajvRequestValidator(updateVehicleSchema, "body"),
    updateVehicleController
);

// DELETE /vehicles/:id
vehiclesRouter.delete(
    "/:id",
    docs.path({
        summary: "Delete vehicle",
        description: "Delete an existing vehicle",
        tags: ["Vehicles"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Vehicle ID"
            }
        ],
        responses: {
            200: generateJSONResponse(Type.Object({ msg: Type.String() }), "Vehicle deleted successfully"),
            ...getErrorResponses(["400", "404", "500"]),
        },
    }),
    deleteVehicleController
);

export { vehiclesRouter };
