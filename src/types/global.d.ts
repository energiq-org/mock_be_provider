import { DataSource } from "typeorm";

declare global {
    namespace Express {
        interface Locals {
            db: DataSource;
        }
    }
}
