import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";
import { TransactionStatus } from "../schemas/transction.js";
import { UUID } from "crypto";

class Transaction extends Model {
  declare id: CreationOptional<UUID>;
  declare status: TransactionStatus;
  declare amount: bigint;
  declare session_id: string;
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
      type: DataTypes.ENUM(...Object.values(TransactionStatus)),
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.UUID,
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
