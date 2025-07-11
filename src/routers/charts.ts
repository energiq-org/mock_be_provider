/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import {
    getRevenueCharts,
    getEnergyCharts,
    getSessionsCharts,
    getHourlyUsageCharts,
    getStationPerformanceCharts,
    getPlugCharts,
    getDurationCharts
} from "../controllers/charts/index.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses, generateJSONResponse } from "../docs/helpers.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import {
    chartQueryParamsSchema,
    revenueChartSchema,
    energyChartSchema,
    sessionsChartSchema,
    hourlyUsageChartSchema,
    stationPerformanceChartSchema,
    plugChartSchema,
    durationChartSchema
} from "../schemas/charts.js";

const router = Router();

// GET /charts/revenue - Get revenue chart data
router.get(
    "/revenue",
    docs.path({
        summary: "Get revenue chart data",
        description: "Get revenue analytics data for charts by time period",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(revenueChartSchema, "Revenue chart data retrieved successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getRevenueCharts
);

// GET /charts/energy - Get energy chart data
router.get(
    "/energy",
    docs.path({
        summary: "Get energy chart data",
        description: "Get energy consumption analytics data for charts by time period",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(energyChartSchema, "Energy chart data retrieved successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getEnergyCharts
);

// GET /charts/sessions - Get sessions chart data
router.get(
    "/sessions",
    docs.path({
        summary: "Get sessions chart data",
        description: "Get charging sessions analytics data for charts by time period",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(sessionsChartSchema, "Sessions chart data retrieved successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getSessionsCharts
);

// GET /charts/hourly-usage - Get hourly usage chart data
router.get(
    "/hourly-usage",
    docs.path({
        summary: "Get hourly usage chart data",
        description: "Get hourly usage patterns and peak hours analytics data",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(hourlyUsageChartSchema, "Hourly usage chart data retrieved successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getHourlyUsageCharts
);

// GET /charts/station-performance - Get station performance chart data
router.get(
    "/station-performance",
    docs.path({
        summary: "Get station performance chart data",
        description: "Get station rankings and performance metrics data",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(stationPerformanceChartSchema, "Station performance chart data retrieved successfully"),
            ...getErrorResponses(["404", "500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getStationPerformanceCharts
);

// GET /charts/plug - Get plug chart data
router.get(
    "/plug",
    docs.path({
        summary: "Get plug utilization chart data",
        description: "Get plug utilization gauge and duration metrics",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(plugChartSchema, "Plug chart data retrieved successfully"),
            ...getErrorResponses(["500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getPlugCharts
);

// GET /charts/duration - Get duration chart data
router.get(
    "/duration",
    docs.path({
        summary: "Get charging duration chart data",
        description: "Get average charging duration and time metrics",
        tags: ["Charts"],
        parameters: generateRequestParameters(chartQueryParamsSchema, "query"),
        responses: {
            200: generateJSONResponse(durationChartSchema, "Duration chart data retrieved successfully"),
            ...getErrorResponses(["500"]),
        },
    }),
    ajvRequestValidator(chartQueryParamsSchema, "query"),
    getDurationCharts
);



export default router; 