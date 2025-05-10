import { UUID } from "crypto";
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  CreationOptional,
  DataTypes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../config/dbConnection.js";
import { Token } from "./token.js";
import { UserVehicle } from "./userVehicle.js";
import { VerificationCode } from "./verificationCode.js";
import { Vehicle } from "./vehicle.js";

interface UserVehicleAttributes {
  connector_type: string;
  actual_battery: string;
}

class User extends Model {
  declare id: CreationOptional<UUID>;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
  declare email: string;
  declare email_verified: CreationOptional<boolean>;
  declare phone_number: CreationOptional<string>;
  declare profile_picture: string;
  declare created_at: CreationOptional<Date>;
  declare tokens?: NonAttribute<Token[]>;
  declare verification_codes?: NonAttribute<VerificationCode[]>;
  declare vehicles?: NonAttribute<UserVehicle[]>;

  declare getVehicles: BelongsToManyGetAssociationsMixin<Vehicle & { UserVehicle: UserVehicle }>;
  declare addVehicle: BelongsToManyAddAssociationMixin<Vehicle, UserVehicleAttributes>;
  declare removeVehicle: BelongsToManyRemoveAssociationMixin<Vehicle, Vehicle["id"]>;
  declare hasVehicle: BelongsToManyHasAssociationMixin<Vehicle, Vehicle["id"]>;
  declare countVehicles: BelongsToManyCountAssociationsMixin;
  declare createVehicle: BelongsToManyCreateAssociationMixin<Vehicle>;

  async getVehiclesTransformed(): Promise<
    Array<{
      id: UUID;
      model: string;
      availability: string;
      range: string;
      efficiency: string;
      weight: string;
      acceleration: string;
      one_stop_range: string;
      battery: string;
      fastcharge: string;
      towing: string;
      cargo_volume: string;
      connector_type: string;
      actual_battery: string;
      created_at: Date;
    }>
  > {
    const vehicles = await this.getVehicles();

    const transformedVehicles = vehicles.map((vehicle) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-unused-vars, @typescript-eslint/no-unused-vars
      const { UserVehicle, id, ...vehicleData } = vehicle.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-unused-vars, @typescript-eslint/no-unused-vars
      const { user_id, vehicle_id, ...rest } = UserVehicle;
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: vehicle_id,
        ...rest,
        ...vehicleData,
      } as {
        id: UUID;
        model: string;
        availability: string;
        range: string;
        efficiency: string;
        weight: string;
        acceleration: string;
        one_stop_range: string;
        battery: string;
        fastcharge: string;
        towing: string;
        cargo_volume: string;
        connector_type: string;
        actual_battery: string;
        created_at: Date;
      };
    });

    return transformedVehicles;
  }
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
    phone_number: DataTypes.STRING,
    profile_picture: DataTypes.TEXT,
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
  onDelete: "CASCADE",
});

User.hasMany(VerificationCode, {
  sourceKey: "id",
  foreignKey: "user_id",
  as: "verification_codes",
  onDelete: "CASCADE",
});

export { User };
