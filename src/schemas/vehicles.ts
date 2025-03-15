import { type } from "arktype";
const vehicleSchema = type({
  id: "string.uuid",
  user_id: "string.uuid",
  vehicle_id: type.number,
  created_at: type.Date,
});

const addVehicleSchema = vehicleSchema.pick("vehicle_id");
const getVehicleSchema = type({
  "id?": "string",
  "model?": "string",
});

const deleteUserVehicleSchema = type({
  id: "string.numeric", 
});

export { vehicleSchema, addVehicleSchema, getVehicleSchema,deleteUserVehicleSchema };
