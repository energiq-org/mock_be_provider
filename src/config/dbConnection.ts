import { Sequelize } from "sequelize";
import config from "./env";

const sequelize = new Sequelize({
  database: config.DB_NAME,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  dialect: "postgres",
  logging: true,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export { sequelize };
