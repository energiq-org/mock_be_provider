import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";
import { OTPType } from "../schemas/OTP.js";

class OTP extends Model {
  declare id: CreationOptional<UUID>;
  declare user_id: UUID;
  declare email: string;
  declare code: string;
  declare used: boolean;
  declare type: OTPType;
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;
}

OTP.init(
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
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        is: /^[0-9]{6}$/, // Exactly 6 digits
        len: [6, 6], // Exactly 6 characters
      },
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(OTPType)),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "otps",
    timestamps: false,
    sequelize,
  }
);

export { OTP };
