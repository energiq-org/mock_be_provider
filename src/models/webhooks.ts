import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";

class Webhooks extends Model {
  declare id: number;
  declare success: boolean;
  declare content: object;
}

Webhooks.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "paymob_transactions",
    sequelize,
    timestamps: false,
  }
);

export { Webhooks };
