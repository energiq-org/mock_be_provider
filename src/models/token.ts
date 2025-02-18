import { Model, CreationOptional ,DataTypes } from 'sequelize';
import sequelize from '../config/dbConnection';


class Token extends Model{
    declare id: CreationOptional<number>;
    declare user_id: string;
    declare refresh_token: string;
    declare expires_at: Date;
    declare revoked_at: Date;
}

Token.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull : false
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        revoked_at: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: 'tokens',
        sequelize
    }
);

export default Token;