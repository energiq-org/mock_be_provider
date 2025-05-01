import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";

class UserVehicle extends Model {
  declare id: CreationOptional<UUID>;
  declare vehicle_id: number;
  declare user_id: UUID;
  declare created_at: CreationOptional<Date>;
}

UserVehicle.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_vehicles",
    sequelize,
    timestamps: false,
  }
);

export { UserVehicle };
