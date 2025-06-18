import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";
import { ConnectorTypeEnum } from "../schemas/userVehicles.js";

class UserVehicle extends Model {
  declare id: CreationOptional<UUID>;
  declare vehicle_id: number;
  declare user_id: UUID;
  declare connector_type: string;
  declare actual_battery: string;
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
    connector_type: {
      type: DataTypes.ENUM(...Object.values(ConnectorTypeEnum)),
      allowNull: false,
    },
    actual_battery: {
      type: DataTypes.STRING,
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
