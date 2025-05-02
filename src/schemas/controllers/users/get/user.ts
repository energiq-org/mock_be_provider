import { type } from "arktype";
import { userSchema } from "../../../users.js";
import { vehicleSchema } from "../../../vehicles.js";

const getUserByAccessToken = type({
  "...": userSchema,
  vehicles: [vehicleSchema],
});
export { getUserByAccessToken };
