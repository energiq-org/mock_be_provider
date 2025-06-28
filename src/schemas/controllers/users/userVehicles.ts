import { Type } from "@sinclair/typebox";
import { userVehicleSchema } from "../../userVehicles.js";
import { vehicleSchema } from "../../vehicles.js";

const addUserVehicleSchema = Type.Pick(userVehicleSchema, ["vehicle_id", "connector_type", "actual_battery"]);

const updateUserVehicleSchema = Type.Pick(userVehicleSchema, ["connector_type", "actual_battery"]);

// Response schemas
const getUserVehiclesResponseSchema = Type.Array(
    Type.Intersect([
        vehicleSchema,
        Type.Pick(userVehicleSchema, ["id", "connector_type", "actual_battery", "created_at"]),
    ])
);

const getUserVehicleStatusResponseSchema = Type.Object({
    last_soc: Type.Number(),
    is_charging: Type.Boolean(),
    last_expected_range: Type.Number(),
    charging_info: Type.Object({
        time_left: Type.Optional(Type.Number()),
        charging_power: Type.Optional(Type.Number()),
    }),
});

export {
    addUserVehicleSchema,
    updateUserVehicleSchema,
    getUserVehiclesResponseSchema,
    getUserVehicleStatusResponseSchema,
};
