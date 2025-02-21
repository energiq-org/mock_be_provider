import { Model, InferAttributes, InferCreationAttributes, CreationOptional ,DataTypes ,NonAttribute } from 'sequelize';
import sequelize from '../config/dbConnection';
import Token from './token';

export class User extends Model<InferAttributes<User, { omit: 'tokens' }>, InferCreationAttributes<User, { omit: 'tokens' }>>{
    declare id: CreationOptional<number>;
    declare first_name: string;
    declare last_name: string;
    declare password: string;
    declare email: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare tokens?: NonAttribute<Token[]>;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'users',
        sequelize,
        timestamps: true,
        hooks: {
            beforeUpdate: (user: User) => {
            user.updatedAt = new Date();
            }
        } 
    }
);

User.hasMany(Token, {
    sourceKey: 'id',
    foreignKey: 'user_id',
    as: 'tokens' 
  });

export default User;