import { Type } from "@sinclair/typebox";
import { userSchema } from "./users.js";
import { vehicleSchema } from "./vehicles.js";
import { StandardEnum } from "./helpers.js";

// Define common connector types
enum ConnectorTypeEnum {
    TYPE_1 = "Type 1",
    TYPE_2 = "Type 2",
    CCS_1 = "CCS1",
    CCS_2 = "CCS2",
    CHAdeMO = "CHAdeMO",
    GB_T = "GB/T",
    Tesla = "Tesla",
}

const userVehicleSchema = Type.Object({
    id: Type.String({
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        description: "UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)",
    }),
    user_id: userSchema.properties.id,
    connector_type: StandardEnum(ConnectorTypeEnum, {
        description: "Connector type",
    }),
    actual_battery: Type.String({
        pattern: "^(([0-9]|[1-9][0-9]|[12][0-9][0-9])(\\.\\d)?|300(\\.0)?)\\s?(kWh|KWh)$",
        description: "Battery capacity in kWh up to 300 kWh (e.g., '75.5 kWh', '100.8 KWh', '300 kWh')",
    }),
    vehicle_id: vehicleSchema.properties.id,
    created_at: Type.String({ format: "date-time" }),
});

const vehicleIdSchema = Type.Object({
    id: userVehicleSchema.properties.id,
});

export { userVehicleSchema, vehicleIdSchema, ConnectorTypeEnum };
