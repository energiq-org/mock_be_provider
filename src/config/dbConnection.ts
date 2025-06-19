import { DataSource } from "typeorm";
import config from "./env.js";
import { OTP } from "../models/OTP.js";
import { Token } from "../models/token.js";
import { User } from "../models/user.js";
import { UserVehicle } from "../models/userVehicle.js";
import { Vehicle } from "../models/vehicle.js";
import { Webhook } from "../models/webhook.js";
import { Transaction } from "../models/transaction.js";
import { Session } from "../models/sessions.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: false,
    logging: config.DB_LOGGING,
    entities: [User, OTP, Token, Vehicle, UserVehicle, Webhook, Transaction, Session],
    migrations: ["src/migrations/*.ts"],
    migrationsTableName: "migrations",
});

// Initialize the data source
export const initializeDatabase = async () => {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        // Run migrations
        await AppDataSource.runMigrations();
        console.log("Migrations have been run successfully!");
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        throw error;
    }
};
