import { Type } from "@sinclair/typebox";
import { userSchema } from "../../users.js";
import { vehicleSchema } from "../../vehicles.js";

export const getUserVehiclesResponseSchema = Type.Object({
  vehicles: Type.Array(
    Type.Intersect([
      vehicleSchema,
      Type.Object({
        connector_type: Type.String(),
        actual_battery: Type.String(),
      }),
    ])
  ),
});

export const getUserByAccessTokenResponseSchema = Type.Intersect([
  userSchema,
  Type.Object({
    vehicles: Type.Array(
      Type.Intersect([
        vehicleSchema,
        Type.Object({
          connector_type: Type.String(),
          actual_battery: Type.String(),
        }),
      ])
    ),
  }),
]);
