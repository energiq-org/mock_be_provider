import { Type } from "@sinclair/typebox";

export const alertSchema = Type.Object({
    id: Type.Number(),
    station_id: Type.Optional(Type.Number()),
    type: Type.Union([
        Type.Literal("Station Offline"),
        Type.Literal("Overheating"),
        Type.Literal("Power Failure"),
        Type.Literal("Charger Fault"),
        Type.Literal("Connector Fault"),
        Type.Literal("Network Issue"),
        Type.Literal("Network Disconnected"),
        Type.Literal("Maintenance Due"),
        Type.Literal("Maintenance Required"),
        Type.Literal("Revenue Anomaly"),
        Type.Literal("High Usage"),
        Type.Literal("Low Battery"),
        Type.Literal("Communication Error"),
        Type.Literal("Temperature Warning")
    ]),
    severity: Type.Union([
        Type.Literal("Low"),
        Type.Literal("Medium"),
        Type.Literal("High"),
        Type.Literal("Critical")
    ]),
    status: Type.Union([
        Type.Literal("Active"),
        Type.Literal("Acknowledged"),
        Type.Literal("Resolved"),
        Type.Literal("Dismissed")
    ]),
    title: Type.String(),
    description: Type.String(),
    charger_id: Type.Optional(Type.String()),
    connector_id: Type.Optional(Type.String()),
    acknowledged_by: Type.Optional(Type.String()),
    acknowledged_at: Type.Optional(Type.String({ format: "date-time" })),
    resolved_at: Type.Optional(Type.String({ format: "date-time" })),
    resolved_by: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    created_at: Type.String({ format: "date-time" }),
    updated_at: Type.String({ format: "date-time" }),
});

// Schema for creating an alert
export const createAlertSchema = Type.Object({
    station_id: Type.Optional(Type.Number()),
    type: Type.Union([
        Type.Literal("Station Offline"),
        Type.Literal("Overheating"),
        Type.Literal("Power Failure"),
        Type.Literal("Charger Fault"),
        Type.Literal("Connector Fault"),
        Type.Literal("Network Issue"),
        Type.Literal("Network Disconnected"),
        Type.Literal("Maintenance Due"),
        Type.Literal("Maintenance Required"),
        Type.Literal("Revenue Anomaly"),
        Type.Literal("High Usage"),
        Type.Literal("Low Battery"),
        Type.Literal("Communication Error"),
        Type.Literal("Temperature Warning")
    ]),
    severity: Type.Optional(Type.Union([
        Type.Literal("Low"),
        Type.Literal("Medium"),
        Type.Literal("High"),
        Type.Literal("Critical")
    ])),
    title: Type.String(),
    description: Type.String(),
    charger_id: Type.Optional(Type.String()),
    connector_id: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});

// Schema for updating an alert
export const updateAlertSchema = Type.Object({
    status: Type.Optional(Type.Union([
        Type.Literal("Active"),
        Type.Literal("Acknowledged"),
        Type.Literal("Resolved"),
        Type.Literal("Dismissed")
    ])),
    acknowledged_by: Type.Optional(Type.String()),
    acknowledged_at: Type.Optional(Type.String({ format: "date-time" })),
    resolved_at: Type.Optional(Type.String({ format: "date-time" })),
    resolved_by: Type.Optional(Type.String()),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});

// Schema for acknowledging an alert
export const acknowledgeAlertSchema = Type.Object({
    acknowledged_by: Type.Optional(Type.String()),
});

export type AlertSchemaType = typeof alertSchema.static; 