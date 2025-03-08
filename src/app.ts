/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from "express";
// import * as OpenApiValidator from "express-openapi-validator";
import { apiReference } from "@scalar/express-api-reference";
import morgan from "morgan";
import morganBody from "morgan-body";
import swaggerUi from "swagger-ui-express";
import config from "./config/env.ts";
import { docs } from "./docs/index.ts";
import { authRouter } from "./routers/auth.ts";
import { usersRouter } from "./routers/users.ts";
import { vehiclesRouter } from "./routers/vehicles.ts";

function createServer() {
  const server = express();

  server.use(express.json());

  if (config.HTTP_LOGGING) {
    server.use(morgan("dev"));
  }

  if (config.HTTP_BODY_LOGGING) {
    morganBody(server);
  }

  server.use("/api/v1/auth", authRouter);
  server.use("/api/v1/vehicles", vehiclesRouter);
  server.use("/api/v1/users", usersRouter);

  const openAPIDocs = docs.generateDocument(docs.document, server._router, docs.options.basePath);

  server.use(docs);

  server.use(
    "/api/v1/docs/scalar",
    apiReference({
      spec: {
        content: openAPIDocs,
      },
    })
  );
  server.use("/api/v1/docs/swagger", swaggerUi.serve, swaggerUi.setup(openAPIDocs));

  // setup API validator
  // const validatorOptions: OpenApiValidatorOpts = {
  //   apiSpec: openAPIDocs,
  //   validateResponses: true,
  //   validateApiSpec: true,
  // };

  // server.use(OpenApiValidator.middleware(validatorOptions));

  // error customization, if request is invalid
  // server.use((err: object, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  //   res.status(Number(err["status"]) || 500).json({
  //     error: {
  //       type: "request_validation",
  //       message: err["message"] as string,
  //       errors: err["errors"] as object,
  //     },
  //   });
  //   next();
  // });

  return server;
}

export { createServer };
