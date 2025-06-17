import { Type } from "@sinclair/typebox";
import { userVehicleSchema } from "../../userVehicles.js";

const addUserVehicleSchema = Type.Object({
  id: userVehicleSchema.properties.vehicle_id,
  connector_type: userVehicleSchema.properties.connector_type,
  actual_battery: userVehicleSchema.properties.actual_battery,
});

const updateUserVehicleSchema = Type.Object({
  connector_type: Type.Optional(userVehicleSchema.properties.connector_type),
  actual_battery: Type.Optional(userVehicleSchema.properties.actual_battery),
});

export { addUserVehicleSchema, updateUserVehicleSchema };
