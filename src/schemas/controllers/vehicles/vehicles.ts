import { Type } from "@sinclair/typebox";
import { vehicleSchema } from "../../vehicles.js";

const getVehiclesQueryParamsSchema = Type.Partial(Type.Pick(vehicleSchema, ["id", "model"]));

export { getVehiclesQueryParamsSchema };
