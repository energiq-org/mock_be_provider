import { Type } from "@sinclair/typebox";
import { userVehicleSchema } from "../../userVehicles.js";
import { vehicleSchema } from "../../vehicles.js";

const addUserVehicleSchema = Type.Object({
  id: userVehicleSchema.properties.vehicle_id,
  connector_type: userVehicleSchema.properties.connector_type,
  actual_battery: userVehicleSchema.properties.actual_battery,
});

const updateUserVehicleSchema = Type.Object({
  connector_type: Type.Optional(userVehicleSchema.properties.connector_type),
  actual_battery: Type.Optional(userVehicleSchema.properties.actual_battery),
});

// Response schemas
const getUserVehiclesResponseSchema = Type.Array(
  Type.Intersect([
    vehicleSchema,
    Type.Object({
      id: userVehicleSchema.properties.id, // UUID
      connector_type: userVehicleSchema.properties.connector_type,
      actual_battery: userVehicleSchema.properties.actual_battery,
      created_at: userVehicleSchema.properties.created_at,
    }),
  ])
);

export { addUserVehicleSchema, updateUserVehicleSchema, getUserVehiclesResponseSchema };
