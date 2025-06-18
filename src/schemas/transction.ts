import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";
import { vehicleSchema } from "./vehicles.js";



enum TransactionStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
  }

const TransactionSchema = Type.Object({
    id: Type.String({
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
      }),
    status: Type.Enum(TransactionStatus),
    amount: Type.Number(),
    session_id: Type.String(),
    user_id: userSchema.properties.id,
    vehicle_id: vehicleSchema.properties.id,
    created_at: Type.String({ format: "date-time" }),
});

export { TransactionSchema, TransactionStatus };

