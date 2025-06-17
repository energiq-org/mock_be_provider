import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";

class Transaction extends Model {
  declare id: string;
  declare status: "pending" | "success" | "failed";
  declare amount: bigint;
  declare session_kw: bigint;
  declare user_id: string;
  declare vehicle_id: string;
  declare created_at: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    session_kw: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicle_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transactions",
    sequelize,
    timestamps: false,
  }
);

export { Transaction };
