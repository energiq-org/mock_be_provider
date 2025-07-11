import { Type } from "@sinclair/typebox";

export const stationSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    location: Type.String(),
    status: Type.Union([
        Type.Literal("Online"),
        Type.Literal("Offline"), 
        Type.Literal("Degraded")
    ]),
    power: Type.String(),
    active_sessions: Type.Number(),
    total_sessions: Type.Number(),
    alerts_count: Type.Number(),
    latitude: Type.Number(),
    longitude: Type.Number(),
    last_seen: Type.Optional(Type.String({ format: "date-time" })),
    chargers_count: Type.Number(),
    connectors_count: Type.Number(),
    total_energy_delivered: Type.Number(),
    total_revenue: Type.Number(),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
});

// Schema for creating a station (without id, created_at, updated_at, and computed fields)
export const createStationSchema = Type.Object({
    name: Type.String(),
    location: Type.String(),
    status: Type.Optional(Type.Union([
        Type.Literal("Online"),
        Type.Literal("Offline"), 
        Type.Literal("Degraded")
    ])),
    power: Type.String(),
    latitude: Type.Number(),
    longitude: Type.Number(),
    chargers_count: Type.Optional(Type.Number()),
    connectors_count: Type.Optional(Type.Number()),
});

// Schema for updating a station (all fields optional)
export const updateStationSchema = Type.Partial(createStationSchema);

export type StationSchemaType = typeof stationSchema.static; 