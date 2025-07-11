import { Type } from "@sinclair/typebox";

// Query parameters for chart endpoints
export const chartQueryParamsSchema = Type.Object({
    period: Type.Optional(Type.Union([
        Type.Literal("thisWeek"),
        Type.Literal("lastWeek"),
        Type.Literal("thisMonth"),
        Type.Literal("lastMonth")
    ]))
});



// Revenue chart response schema
export const revenueChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        period: Type.String(),
        revenue_by_day: Type.Array(Type.Number()),
        total_revenue: Type.Number(),
        weekly_breakdown: Type.Union([Type.Array(Type.Number()), Type.Null()]),
        monthly_trends: Type.Union([Type.Object({
            growth_rate: Type.Number(),
            efficiency_improvement: Type.Number(),
            customer_satisfaction: Type.Number(),
        }), Type.Null()]),
    })
});

// Energy chart response schema
export const energyChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        period: Type.String(),
        energy_by_day: Type.Array(Type.Number()),
        total_energy_delivered: Type.Number(),
        energy_by_week: Type.Union([Type.Array(Type.Number()), Type.Null()]),
    })
});

// Sessions chart response schema
export const sessionsChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        period: Type.String(),
        sessions_by_day: Type.Array(Type.Number()),
        success_rate_by_day: Type.Array(Type.Number()),
        total_sessions: Type.Number(),
        sessions_by_week: Type.Union([Type.Array(Type.Number()), Type.Null()]),
    })
});

// Hourly usage chart response schema
export const hourlyUsageChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        period: Type.String(),
        hourly_pattern: Type.Array(Type.Number()),
        peak_hours: Type.Array(Type.Number()),
        average_hourly_usage: Type.Number(),
        utilization_rate: Type.Number(),
    })
});

// Station performance chart response schema  
export const stationPerformanceChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Array(Type.Object({
        name: Type.String(), // station name
        value: Type.Number() // sessions count
    }))
});

// Plug chart response schema
export const plugChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        period: Type.String(),
        duration: Type.String(), // e.g., "+5" or "-3"
        gauge: Type.Number(), // percentage for gauge
    })
});

// Duration chart response schema
export const durationChartSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Object({
        period: Type.String(),
        duration: Type.String(), // e.g., "+15" or "-8"
        time: Type.Number(), // time value in minutes
    })
});



export type ChartQueryParamsType = typeof chartQueryParamsSchema.static;
export type RevenueChartType = typeof revenueChartSchema.static;
export type EnergyChartType = typeof energyChartSchema.static;
export type SessionsChartType = typeof sessionsChartSchema.static;
export type HourlyUsageChartType = typeof hourlyUsageChartSchema.static;
export type StationPerformanceChartType = typeof stationPerformanceChartSchema.static;
export type PlugChartType = typeof plugChartSchema.static;
export type DurationChartType = typeof durationChartSchema.static;
 