import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.ts";

class UserVehicle extends Model {
  declare id: CreationOptional<UUID>;
  declare vehicle_id: number;
  declare user_id: UUID;
  declare created_at: CreationOptional<Date>;
}

UserVehicle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
