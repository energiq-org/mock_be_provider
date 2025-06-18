import { Type, Static } from "@sinclair/typebox";

const vehicleSchema = Type.Object({
  id: Type.Number({ minimum: 1 }),
  model: Type.String(),
  availability: Type.String(),
  range: Type.String(),
  efficiency: Type.String(),
  weight: Type.String(),
  acceleration: Type.String(),
  one_stop_range: Type.String(),
  battery: Type.String(),
  fastcharge: Type.String(),
  towing: Type.String(),
  cargo_volume: Type.String(),
  created_at: Type.String({ format: "date-time" }),
});

type VehicleSchemaType = Static<typeof vehicleSchema>;

export { vehicleSchema, VehicleSchemaType };
