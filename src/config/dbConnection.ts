import { DataSource } from "typeorm";
import config from "./env.js";
import { Vehicle } from "../models/vehicle.js";
import { Station } from "../models/station.js";
import { Session } from "../models/session.js";
import { Alert } from "../models/alert.js";
import { Analytics } from "../models/analytics.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    logging: config.DB_LOGGING,
    entities: [Vehicle, Station, Session, Alert, Analytics],
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
