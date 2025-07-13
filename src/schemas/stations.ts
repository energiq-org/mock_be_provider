import { Type } from "@sinclair/typebox";

// Operating hours schema
export const operatingHoursSchema = Type.Object({
    saturday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
    sunday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
    monday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
    tuesday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
    wednesday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
    thursday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
    friday: Type.Object({
        enabled: Type.Boolean(),
        from: Type.String(),
        to: Type.String(),
    }),
});

// Connector schema
export const connectorSchema = Type.Object({
    type: Type.Union([
        Type.Literal("Type 1"),
        Type.Literal("Type 2"),
        Type.Literal("CHAdeMO"),
        Type.Literal("CCS"),
        Type.Literal("Tesla")
    ]),
    status: Type.Union([
        Type.Literal("Available"),
        Type.Literal("Occupied"),
        Type.Literal("Faulted"),
        Type.Literal("Offline"),
        Type.Literal("Maintenance")
    ]),
    power: Type.Number(),
});

// Charger schema
export const chargerSchema = Type.Object({
    type: Type.Union([
        Type.Literal("AC"),
        Type.Literal("DC")
    ]),
    power: Type.Number(),
    status: Type.Union([
        Type.Literal("Available"),
        Type.Literal("Occupied"),
        Type.Literal("Faulted"),
        Type.Literal("Offline"),
        Type.Literal("Maintenance")
    ]),
    connectors: Type.Array(connectorSchema),
});

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

// Schema for creating a station with full charger and connector details
export const createStationSchema = Type.Object({
    name: Type.String(),
    location: Type.String(),
    latitude: Type.Number(),
    longitude: Type.Number(),
    status: Type.Union([
        Type.Literal("Active"),
        Type.Literal("Under Maintenance"),
        Type.Literal("Closed")
    ]),
    operatingHours: Type.Optional(Type.Union([operatingHoursSchema, Type.Null()])),
    chargers: Type.Array(chargerSchema),
});

// Schema for updating a station (all fields optional)
export const updateStationSchema = Type.Partial(createStationSchema);

export type StationSchemaType = typeof stationSchema.static; 