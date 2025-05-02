import { type } from "arktype";
import { userSchema } from "../../../users.js";
import { vehicleSchema } from "../../../vehicles.js";

const getUserByAccessTokenResponseSchema = type({
  "...": userSchema,
  vehicles: [vehicleSchema],
});
export { getUserByAccessTokenResponseSchema };
