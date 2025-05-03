import { Sequelize } from "sequelize";
import config from "./env.js";

const sequelize = new Sequelize({
  database: config.DB_NAME,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  dialect: "postgres",
  logging: config.DB_LOGGING,
  //dialectOptions: {
  //  ssl: {
  //    rejectUnauthorized: true,
  //  },
  //},
});

export { sequelize };
