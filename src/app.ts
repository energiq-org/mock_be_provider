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
import { Paymob } from "./utils/paymob.js";

function createServer() {
    const server = express();

    server.locals.fuzzySearcher = new FuzzySearcher(new VehiclesDBLoader());
    server.locals.paymob = new Paymob(config.PAYMOB_API_KEY, config.PAYMOB_SECRET_KEY, config.PAYMOB_PUBLIC_KEY, [
        config.PAYMOB_PAYMENT_METHOD,
    ]);

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

    // Serve static files (including logo)
    server.use("/static", express.static("public"));

    const openAPIDocs = docs.generateDocument(docs.document, server._router, docs.options.basePath);

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
        .swagger-ui .info::before {
            content: '';
            display: block;
            background-image: url('/static/logo.png');
            background-repeat: no-repeat;
            background-size: contain;
            width: 160px;
            height: 60px;
            margin-bottom: 20px;
        }
      `,
        })
    );

    server.use("/", (req, res) => {
        res.status(404).json({ msg: "Not Found" });
    });

    return server;
}

export { createServer };
