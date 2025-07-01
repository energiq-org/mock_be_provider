import { DataSource } from "typeorm";
import { FuzzySearcher } from "../utils/fuzzySearcher.js";
import { Paymob } from "@src/utils/paymob.ts";

declare global {
    namespace Express {
        interface Application {
            locals: {
                db: DataSource;
                fuzzySearcher: FuzzySearcher;
                paymob: Paymob;
            };
        }
    }
}
