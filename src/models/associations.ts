import { User } from "./user.js";
import { Vehicle } from "./vehicle.js";
import { UserVehicle } from "./userVehicle.js";

export function initializeAssociations() {
  Vehicle.belongsToMany(User, {
    through: UserVehicle,
    foreignKey: "vehicle_id",
    otherKey: "user_id",
    as: "users",
    onDelete: "CASCADE",
  });

  User.belongsToMany(Vehicle, {
    through: UserVehicle,
    foreignKey: "user_id",
    otherKey: "vehicle_id",
    as: "vehicles",
    onDelete: "CASCADE",
  });
}
