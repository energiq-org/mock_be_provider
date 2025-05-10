import { Type } from "@sinclair/typebox";

const userVehicleSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  vehicle_id: Type.Number(),
  created_at: Type.String(),
});

const vehicleIdSchema = Type.Object({
  id: Type.String(),
});

export { userVehicleSchema, vehicleIdSchema };
