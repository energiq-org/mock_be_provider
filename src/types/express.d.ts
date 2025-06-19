import { DataSource } from "typeorm";
import { VehiclesDBLoader } from "../utils/vehicleDBLoader.js";
import { FuzzySearcher } from "../utils/fuzzySearcher.js";

declare global {
    namespace Express {
        interface Application {
            locals: {
                db: DataSource;
                vehicles: VehiclesDBLoader;
                fuzzySearcher: FuzzySearcher;
            };
        }
    }
}
