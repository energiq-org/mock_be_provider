import { Model, CreationOptional, DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnection";
import { UUID } from "crypto";

class VerificationCode extends Model {
  declare id: CreationOptional<UUID>;
  declare user_id: UUID;
  declare email: string;
  declare code: string;
  declare used: boolean;
  declare expires_at: Date;
}

VerificationCode.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
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
  },
  {
    tableName: "verification_codes",
    sequelize,
  }
);

export { VerificationCode };
