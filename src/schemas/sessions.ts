import { Type } from "@sinclair/typebox";

export const sessionSchema = Type.Object({
    id: Type.Number(),
    station_id: Type.Number(),
    status: Type.Union([
        Type.Literal("Paid"),
        Type.Literal("In Progress"),
        Type.Literal("Failed"),
        Type.Literal("Active"),
        Type.Literal("Completed"),
        Type.Literal("Cancelled")
    ]),
    user_id: Type.Optional(Type.String()),
    energy_delivered: Type.Number(),
    cost: Type.Number(),
    start_time: Type.Optional(Type.String({ format: "date-time" })),
    end_time: Type.Optional(Type.String({ format: "date-time" })),
    duration_minutes: Type.Number(),
    success_rate: Type.Number(),
    plug_in_successful: Type.Boolean(),
    charger_id: Type.Optional(Type.String()),
    connector_id: Type.Optional(Type.String()),
    peak_power: Type.Number(),
    average_power: Type.Number(),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
});

// Schema for creating a session
export const createSessionSchema = Type.Object({
    station_id: Type.Number(),
    user_id: Type.Optional(Type.String()),
    charger_id: Type.Optional(Type.String()),
    connector_id: Type.Optional(Type.String()),
});

// Schema for updating a session
export const updateSessionSchema = Type.Object({
    status: Type.Optional(Type.Union([
        Type.Literal("Paid"),
        Type.Literal("In Progress"),
        Type.Literal("Failed"),
        Type.Literal("Active"),
        Type.Literal("Completed"),
        Type.Literal("Cancelled")
    ])),
    energy_delivered: Type.Optional(Type.Number()),
    cost: Type.Optional(Type.Number()),
    end_time: Type.Optional(Type.String({ format: "date-time" })),
    duration_minutes: Type.Optional(Type.Number()),
    success_rate: Type.Optional(Type.Number()),
    plug_in_successful: Type.Optional(Type.Boolean()),
    peak_power: Type.Optional(Type.Number()),
    average_power: Type.Optional(Type.Number()),
});

export type SessionSchemaType = typeof sessionSchema.static; 