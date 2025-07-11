import { Type } from "@sinclair/typebox";

// Data point schemas matching frontend expectations
export const barDataPointSchema = Type.Object({
    day: Type.String(),
    value: Type.Number(),
});

export const areaDataPointSchema = Type.Object({
    day: Type.String(),
    value: Type.Number(),
    fullDay: Type.String(),
});

export const hbarDataPointSchema = Type.Object({
    name: Type.String(),
    value: Type.Number(),
});

export const heatmapDataSchema = Type.Record(
    Type.String(), // day
    Type.Record(Type.String(), Type.Number()) // hour -> value
);

export const performanceMetricsSchema = Type.Object({
    duration: Type.String(), // e.g., "+5%"
    gauge: Type.Optional(Type.Number()), // for success rate
    time: Type.Optional(Type.Number()), // for average duration
});

// Dashboard dataset schema (matches frontend variant.tsx)
export const dashboardDatasetSchema = Type.Object({
    bar: Type.Array(barDataPointSchema),
    area: Type.Array(areaDataPointSchema),
    Hbar: Type.Array(hbarDataPointSchema),
    Heatmap: heatmapDataSchema,
    Plug: Type.Optional(performanceMetricsSchema),
    Duration: Type.Optional(performanceMetricsSchema),
});

// Dashboard summary metrics schema
export const dashboardSummarySchema = Type.Object({
    onlineStations: Type.Object({
        total: Type.Number(),
        online: Type.Number(),
        offline: Type.Number()
    }),
    revenue: Type.Object({
        total: Type.Number(),
        currency: Type.String(), // e.g., "EGP"
        period: Type.String() // e.g., "today"
    }),
    energyDelivered: Type.Object({
        total: Type.Number(),
        unit: Type.String(), // e.g., "kWh"
        period: Type.String() // e.g., "since midnight"
    }),
    alerts: Type.Object({
        total: Type.Number(),
        urgent: Type.Number()
    })
});

// Complete dashboard response schema
export const dashboardResponseSchema = Type.Object({
    summary: dashboardSummarySchema,
    datasets: Type.Object({
        thisWeek: dashboardDatasetSchema,
        lastWeek: dashboardDatasetSchema,
    }),
});

// Analytics entity schema
export const analyticsSchema = Type.Object({
    id: Type.Number(),
    metric_type: Type.Union([
        Type.Literal("dailySessions"),
        Type.Literal("dailyEnergy"),
        Type.Literal("hourlyUsage"),
        Type.Literal("stationPerformance"),
        Type.Literal("revenueSummary")
    ]),
    time_period: Type.Union([
        Type.Literal("thisWeek"),
        Type.Literal("lastWeek"),
        Type.Literal("thisMonth"),
        Type.Literal("lastMonth")
    ]),
    date: Type.String({ format: "date-time" }),
    data: Type.Record(Type.String(), Type.Unknown()),
    total_stations: Type.Number(),
    online_stations: Type.Number(),
    offline_stations: Type.Number(),
    total_revenue: Type.Number(),
    total_energy_delivered: Type.Number(),
    total_sessions: Type.Number(),
    active_alerts: Type.Number(),
    critical_alerts: Type.Number(),
    plug_in_success_rate: Type.Number(),
    average_session_duration: Type.Number(),
    utilization_rate: Type.Number(),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
});

export type DashboardResponseType = typeof dashboardResponseSchema.static;
export type AnalyticsSchemaType = typeof analyticsSchema.static; 