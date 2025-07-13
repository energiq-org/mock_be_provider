/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    restartChargerController,
    rebootChargerController,
    deleteChargerController
} from "../controllers/chargers/index.js";
import { docs } from "../docs/index.js";
import { getErrorResponses, generateJSONResponse } from "../docs/helpers.js";
import { Type } from "@sinclair/typebox";

const chargersRouter = Router();

// POST /chargers/:id/restart - Restart charger
chargersRouter.post(
    "/:id/restart",
    docs.path({
        summary: "Restart charger",
        description: "Restart an existing charger",
        tags: ["Chargers"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Charger ID"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    msg: Type.String(),
                    data: Type.Any(),
                }),
                "Charger restarted successfully"
            ),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    restartChargerController
);

// POST /chargers/:id/reboot - Reboot charger
chargersRouter.post(
    "/:id/reboot",
    docs.path({
        summary: "Reboot charger",
        description: "Reboot an existing charger",
        tags: ["Chargers"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Charger ID"
            }
        ],
        responses: {
            200: generateJSONResponse(
                Type.Object({
                    msg: Type.String(),
                    data: Type.Any(),
                }),
                "Charger rebooted successfully"
            ),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    rebootChargerController
);

// DELETE /chargers/:id - Delete charger
chargersRouter.delete(
    "/:id",
    docs.path({
        summary: "Delete charger",
        description: "Delete an existing charger and all its connectors",
        tags: ["Chargers"],
        parameters: [
            {
                in: "path",
                name: "id",
                required: true,
                schema: { type: "number" },
                description: "Charger ID"
            }
        ],
        responses: {
            200: generateJSONResponse(Type.Object({ msg: Type.String() }), "Charger deleted successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    deleteChargerController
);

export { chargersRouter }; 