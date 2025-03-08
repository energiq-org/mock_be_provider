import { type } from "arktype";
const vehicleSchema = type({
  id: "string.uuid",
  user_id: "string.uuid",
  vehicle_id: type.number,
  created_at: type.Date,
});

const addVehicleSchema = vehicleSchema.pick("vehicle_id");
const getVehicleSchema = type({
  id: type.string,
  model: type.string,
});

export { vehicleSchema, addVehicleSchema, getVehicleSchema };
