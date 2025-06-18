import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";
import { vehicleSchema } from "./vehicles.js";

// Define common connector types
const ConnectorTypeEnum = {
  TYPE_1: "Type 1",
  TYPE_2: "Type 2",
  CCS_1: "CCS1",
  CCS_2: "CCS2",
  CHAdeMO: "CHAdeMO",
  GB_T: "GB/T",
  Tesla: "Tesla",
};

const userVehicleSchema = Type.Object({
  id: Type.String({
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
  }),
  user_id: userSchema.properties.id,
  connector_type: Type.Union([
    Type.Literal(ConnectorTypeEnum.TYPE_1),
    Type.Literal(ConnectorTypeEnum.TYPE_2),
    Type.Literal(ConnectorTypeEnum.CCS_1),
    Type.Literal(ConnectorTypeEnum.CCS_2),
    Type.Literal(ConnectorTypeEnum.CHAdeMO),
    Type.Literal(ConnectorTypeEnum.GB_T),
    Type.Literal(ConnectorTypeEnum.Tesla),
  ]),
  actual_battery: Type.String({
    pattern: "^\\d+(\\.\\d+)?\\s?(kWh|%|kwh)$",
    description: "Battery capacity in kWh or percentage (e.g., '75.5 kWh', '85%')",
  }),
  vehicle_id: vehicleSchema.properties.id,
  created_at: Type.Date(),
});

const vehicleIdSchema = Type.Object({
  id: userVehicleSchema.properties.id,
});

export { userVehicleSchema, vehicleIdSchema, ConnectorTypeEnum };
