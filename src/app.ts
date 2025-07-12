import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import morgan from "morgan";
import cors from "cors";
import morganBody from "morgan-body";
import swaggerUi from "swagger-ui-express";
import config from "./config/env.js";
import { docs } from "./docs/index.js";
// import { vehiclesRouter } from "./routers/vehicles.js";
import { dashboardRouter } from "./routers/dashboard.js";
// import { stationsRouter } from "./routers/stations.js";
import { sessionsRouter } from "./routers/sessions.js";
// import { alertsRouter } from "./routers/alerts.js";
import chartsRouter from "./routers/charts.js";
import { getThemeSync } from "@intelika/swagger-theme";

function createServer() {
    const server = express();

    server.use(cors());

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    if (config.HTTP_LOGGING) {
        server.use(morgan("dev"));
    }

    if (config.HTTP_BODY_LOGGING) {
        morganBody(server);
    }

    // Routes - Only include endpoints that are actively used by the frontend
    server.use("/api/v1/dashboard", dashboardRouter);
    server.use("/api/v1/charts", chartsRouter);
    server.use("/api/v1/sessions", sessionsRouter);
    
    // Unused routes (commented out to hide from documentation)
    // These endpoints exist but are not called by the frontend:
    // server.use("/api/v1/stations", stationsRouter);     // Frontend uses external OpenChargeMap API
    // server.use("/api/v1/alerts", alertsRouter);         // Not implemented in frontend  
    // server.use("/api/v1/vehicles", vehiclesRouter);     // Not implemented in frontend

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
