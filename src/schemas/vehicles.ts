import { Type } from "@sinclair/typebox";

export const vehicleSchema = Type.Object({
    id: Type.Number(),
    model: Type.String(),
    availability: Type.String(),
    range: Type.String(),
    efficiency: Type.String(),
    weight: Type.String(),
    acceleration: Type.String(),
    one_stop_range: Type.String(),
    battery: Type.String(),
    fastcharge: Type.String(),
    towing: Type.String(),
    cargo_volume: Type.String(),
    created_at: Type.Date(),
});

export type VehicleSchemaType = typeof vehicleSchema.static;
