import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import morgan from "morgan";
import cors from "cors";
import morganBody from "morgan-body";
import swaggerUi from "swagger-ui-express";
import config from "./config/env.js";
import { docs } from "./docs/index.js";
import { authRouter } from "./routers/auth.js";
import { usersRouter } from "./routers/users.js";
import { vehiclesRouter } from "./routers/vehicles.js";
import { getThemeSync } from "@intelika/swagger-theme";
import { paymentRouter } from "./routers/payment.js";
import { FuzzySearcher } from "./utils/fuzzySearcher.js";
import { VehiclesDBLoader } from "./utils/vehicleDBLoader.js";

function createServer() {
    const server = express();
    server.locals.fuzzySearcher = new FuzzySearcher(new VehiclesDBLoader());

    server.use(cors());

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    if (config.HTTP_LOGGING) {
        server.use(morgan("dev"));
    }

    if (config.HTTP_BODY_LOGGING) {
        morganBody(server);
    }

    server.use("/api/v1/auth", authRouter);
    server.use("/api/v1/vehicles", vehiclesRouter);
    server.use("/api/v1/users", usersRouter);
    server.use("/api/v1/payment", paymentRouter);

    const openAPIDocs = docs.generateDocument(docs.document, server._router, docs.options.basePath);

    // console.log(JSON.stringify(openAPIDocs, null, 2));

    server.use(docs);

    server.use(
        "/docs/scalar",
        apiReference({
            spec: {
                content: openAPIDocs,
            },
        })
    );
    server.use(
        "/docs/swagger",
        swaggerUi.serve,
        swaggerUi.setup(openAPIDocs, {
            customCss: `
        ${getThemeSync().toString()}
        .swagger-ui .topbar { display: none !important; }
      `,
        })
    );

    return server;
}

export { createServer };
