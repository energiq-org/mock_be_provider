import { Type } from "@sinclair/typebox";

const userVehicleSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  connector_type: Type.String(),
  actual_battery: Type.String(),
  vehicle_id: Type.Number(),
  created_at: Type.String(),
});

const vehicleIdSchema = Type.Object({
  id: userVehicleSchema.properties.id,
});

export { userVehicleSchema, vehicleIdSchema };
