import { DataSource } from "typeorm";
import { FuzzySearcher } from "../utils/fuzzySearcher.ts";
import { Paymob } from "@src/utils/paymob.ts";

declare global {
    namespace Express {
        interface Locals {
            db: DataSource;
            fuzzySearcher: FuzzySearcher;
            paymob: Paymob;
        }
    }
}
