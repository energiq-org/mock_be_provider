import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";

class ResetPasswordCode extends Model {
  declare id: CreationOptional<UUID>;
  declare user_id: UUID;
  declare email: string;
  declare code: string;
  declare used: boolean;
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;
}

ResetPasswordCode.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.CHAR(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reset_password_codes",
    timestamps: false,
    sequelize,
  }
);

export { ResetPasswordCode };
