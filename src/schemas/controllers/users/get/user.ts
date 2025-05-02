import { type } from "arktype";
import { userSchema } from "../../../users.ts";
import { vehicleSchema } from "../../../vehicles.ts";

const getUserByAccessToken = type({
  "...": userSchema,
  vehicles: [vehicleSchema],
});
export { getUserByAccessToken };
