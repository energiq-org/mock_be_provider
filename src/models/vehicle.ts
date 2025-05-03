import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";

class Vehicle extends Model {
  declare id: number;
  declare model: string;
  declare availability: string;
  declare range: string;
  declare efficiency: string;
  declare weight: string;
  declare acceleration: string;
  declare one_stop_range: string;
  declare battery: string;
  declare fastcharge: string;
  declare towing: string;
  declare cargo_volume: string;
  declare created_at: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    range: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    efficiency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acceleration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    one_stop_range: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    battery: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fastcharge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    towing: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cargo_volume: {
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
    tableName: "vehicles",
    sequelize,
    timestamps: false,
  }
);

export { Vehicle };
