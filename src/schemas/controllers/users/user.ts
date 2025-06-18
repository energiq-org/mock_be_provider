import { Type } from "@sinclair/typebox";
import { userSchema } from "../../users.js";
import { vehicleSchema } from "../../vehicles.js";

const signupSchema = Type.Pick(userSchema, ["first_name", "last_name", "email", "password"]);

const updateUserSchema = Type.Object({
  first_name: Type.Optional(userSchema.properties.first_name),
  last_name: Type.Optional(userSchema.properties.last_name),
  email: Type.Optional(userSchema.properties.email),
  phone_number: Type.Optional(userSchema.properties.phone_number),
});

const updateUserPasswordSchema = Type.Object({
  old_password: userSchema.properties.password,
  new_password: userSchema.properties.password,
});

const getUserVehiclesResponseSchema = Type.Object({
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

const getUserByAccessTokenResponseSchema = Type.Intersect([
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

export {
  getUserByAccessTokenResponseSchema,
  getUserVehiclesResponseSchema,
  signupSchema,
  updateUserSchema,
  updateUserPasswordSchema,
};
