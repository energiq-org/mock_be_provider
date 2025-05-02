import { type } from "arktype";
import { vehicleSchema } from "../../vehicles.js";

const getVehiclesQueryParamsSchema = type({
  "id?": vehicleSchema.get("id"),
  "model?": vehicleSchema.get("model"),
});

export { getVehiclesQueryParamsSchema };
