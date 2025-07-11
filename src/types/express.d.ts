import { DataSource } from "typeorm";

declare global {
    namespace Express {
        interface Application {
            locals: {
                db: DataSource;
            };
        }
    }
}
