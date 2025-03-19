import { type } from "arktype";

const vehicleSchema = type({
  id: "string.uuid",
  user_id: "string.uuid",
  vehicle_id: type.number,
  created_at: type.Date,
});

const getVehicleSchema = type({
  "id?": "string",
  "model?": "string",
});

const vehicleIdSchema = type({
  id: "string",
});

export { vehicleSchema, getVehicleSchema, vehicleIdSchema };
