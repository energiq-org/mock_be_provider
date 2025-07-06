import { DataSource } from "typeorm";
import { FuzzySearcher } from "../utils/fuzzySearcher.js";
import { Paymob } from "@src/utils/paymob.ts";
import { Static } from "@sinclair/typebox";
import { accessTokenPayloadSchema } from "../schemas/token.js";

declare global {
    namespace Express {
        interface Application {
            locals: {
                db: DataSource;
                fuzzySearcher: FuzzySearcher;
                paymob: Paymob;
            };
        }

        interface Request {
            user: Static<typeof accessTokenPayloadSchema>["user"];
            userId: string;
        }
    }
}
