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

// Schema for creating a vehicle (without id and created_at)
export const createVehicleSchema = Type.Object({
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
});

// Schema for updating a vehicle (all fields optional)
export const updateVehicleSchema = Type.Partial(createVehicleSchema);

export type VehicleSchemaType = typeof vehicleSchema.static;
