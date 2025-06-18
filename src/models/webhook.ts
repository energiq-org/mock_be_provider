import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";
import { UUID } from "crypto";

class Webhook extends Model {
  declare id: CreationOptional<UUID>;
  declare success: boolean;
  declare content: object;
}

Webhook.init(
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
    tableName: "Webhooks",
    sequelize,
    timestamps: false,
  }
);

export { Webhook };
