import { DataSource } from "typeorm";
import { VehiclesDBLoader } from "../utils/vehicleDBLoader.ts";
import { FuzzySearcher } from "../utils/fuzzySearcher.ts";

declare global {
    namespace Express {
        interface Locals {
            db: DataSource;
            vehicles: VehiclesDBLoader;
            fuzzySearcher: FuzzySearcher;
        }
    }
}
