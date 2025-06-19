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

export { addUserVehicleSchema, updateUserVehicleSchema, getUserVehiclesResponseSchema };
