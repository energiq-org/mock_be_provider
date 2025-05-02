import { type } from "arktype";

const vehicleSchema = type({
  id: "number",
  model: "string",
  availability: "string",
  range: "string",
  efficiency: "string",
  weight: "string",
  acceleration: "string",
  "1_stop_range": "string",
  battery: "string",
  fastcharge: "string",
  towing: "string",
  cargo_volume: "string",
});

export { vehicleSchema };
