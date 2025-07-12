import { Type } from "@sinclair/typebox";

// Query parameters for dashboard endpoints
export const getDashboardQueryParamsSchema = Type.Object({
    period: Type.Optional(Type.Union([
        Type.Literal("thisWeek"),
        Type.Literal("lastWeek"),
        Type.Literal("thisMonth"),
        Type.Literal("lastMonth")
    ]))
});

export const getStationsQueryParamsSchema = Type.Object({
    status: Type.Optional(Type.Union([
        Type.Literal("Online"),
        Type.Literal("Offline"),
        Type.Literal("Degraded")
    ])),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Number({ minimum: 0 })),
});

export const getSessionsQueryParamsSchema = Type.Object({
    station_id: Type.Optional(Type.Number()),
    status: Type.Optional(Type.Union([
        Type.Literal("Paid"),
        Type.Literal("In Progress"),
        Type.Literal("Failed"),
        Type.Literal("Active"),
        Type.Literal("Completed"),
        Type.Literal("Cancelled")
    ])),
    start_date: Type.Optional(Type.String({ format: "date" })),
    end_date: Type.Optional(Type.String({ format: "date" })),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Number({ minimum: 0 })),
});

export const getAlertsQueryParamsSchema = Type.Object({
    station_id: Type.Optional(Type.Number()),
    severity: Type.Optional(Type.Union([
        Type.Literal("Low"),
        Type.Literal("Medium"),
        Type.Literal("High"),
        Type.Literal("Critical")
    ])),
    status: Type.Optional(Type.Union([
        Type.Literal("Active"),
        Type.Literal("Acknowledged"),
        Type.Literal("Resolved"),
        Type.Literal("Dismissed")
    ])),
    limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
    offset: Type.Optional(Type.Number({ minimum: 0 })),
}); 