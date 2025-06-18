import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";
import { userVehicleSchema } from "./userVehicles.js";

const SessionSchema = Type.Object({
  id: Type.String({
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
  }),
  user_id: userSchema.properties.id,
  vehicle_id: userVehicleSchema.properties.id,
  duration: Type.Number(),
  kw_consumed: Type.Number(),
  created_at: Type.String({ format: "date-time" }),
});

export { SessionSchema };
