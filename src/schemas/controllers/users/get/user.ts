import { Type } from "@sinclair/typebox";
import { userSchema } from "../../../users.js";
import { vehicleSchema } from "../../../vehicles.js";

const getUserByAccessTokenResponseSchema = Type.Composite([
  userSchema,
  Type.Object({
    vehicles: Type.Array(vehicleSchema),
  }),
]);

export { getUserByAccessTokenResponseSchema };
