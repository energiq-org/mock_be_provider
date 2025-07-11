/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getDashboardSummaryController
} from "../controllers/dashboard/index.js";
import { docs } from "../docs/index.js";
import { getErrorResponses, generateJSONResponse } from "../docs/helpers.js";
import { dashboardSummarySchema } from "../schemas/analytics.js";

const dashboardRouter = Router();

// GET /dashboard/summary - Dashboard summary metrics only
dashboardRouter.get(
    "/summary",
    docs.path({
        summary: "Get dashboard summary metrics",
        description: "Get only the summary metric cards (stations, revenue, energy, alerts)",
        tags: ["Dashboard"],
        responses: {
            200: generateJSONResponse(dashboardSummarySchema, "Dashboard summary retrieved successfully"),
            ...getErrorResponses(["500"]),
        },
    }),
    getDashboardSummaryController
);

export { dashboardRouter }; 