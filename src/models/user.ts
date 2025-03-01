import { UUID } from "crypto";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../config/dbConnection";
import { Token } from "./token";
import { VerificationCode } from "./verificationCode";

class User extends Model<
  InferAttributes<User, { omit: "tokens" | "verification_codes" }>,
  InferCreationAttributes<User, { omit: "tokens" | "verification_codes" }>
> {
  declare id: CreationOptional<UUID>;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
  declare email: string;
  declare email_verified: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare tokens?: NonAttribute<Token[]>;
  declare verification_codes?: NonAttribute<VerificationCode[]>;
}

/*
  * We used to have updated_at column in the table because Samy likes keeping track of stuff
  * but no body gives a shit about it hence it was nuked by me
*/

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    email_verified: {
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
    tableName: "users",
    sequelize,
    timestamps: false,
  }
);

User.hasMany(Token, {
  sourceKey: "id",
  foreignKey: "user_id",
  as: "tokens",
});

User.hasMany(VerificationCode, {
  sourceKey: "id",
  foreignKey: "user_id",
  as: "verification_codes",
});

export { User };
