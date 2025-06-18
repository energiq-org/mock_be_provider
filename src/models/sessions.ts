import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection.js";
import { UUID } from "crypto";

class Session extends Model {
  declare id: CreationOptional<UUID>;
  declare user_id: UUID;
  declare vehicle_id: UUID;
  declare duration: number;
  declare kw_consumed: number;
  declare created_at: CreationOptional<Date>;
}

Session.init(
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
            type: DataTypes.UUID,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        kw_consumed: {
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
        tableName: "sessions",
        sequelize,
        timestamps: false,
    }
);

export { Session };
