import { type } from "arktype";

const userVehicleSchema = type({
  id: "string.uuid",
  user_id: "string.uuid",
  vehicle_id: "number",
  created_at: "string",
});

const vehicleIdSchema = type({
  id: "string",
});

export { userVehicleSchema, vehicleIdSchema };
