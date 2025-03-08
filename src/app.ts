import express from "express";
// import * as OpenApiValidator from "express-openapi-validator";
import morgan from "morgan";
import morganBody from "morgan-body";
import { summarise } from "swagger-routes-express";
import YAML from "yamljs";
import config from "./config/env.ts";
import { authRouter } from "./routers/auth.ts";
import { usersRouter } from "./routers/users.ts";
import { vehiclesRouter } from "./routers/vehicles.ts";
import logger from "./utils/logging.ts";

function createServer() {
  const yamlSpecFile = "./openapi.yml";
  const apiDefinition = YAML.load(yamlSpecFile) as object;
  const apiSummary = summarise(apiDefinition);
  logger.info(apiSummary);
  const server = express();
  server.use(express.json());

  if (config.HTTP_LOGGING) {
    server.use(morgan("dev"));
  }

  if (config.HTTP_BODY_LOGGING) {
    morganBody(server);
  }

  // setup API validator
  // const validatorOptions = {
  //   apiSpec: yamlSpecFile,
  //   validateRequests: config.SPEC_REQUEST_VALIDATION,
  //   validateResponses: config.SPEC_RESPONSE_VALIDATION,
  // };

  // server.use(OpenApiValidator.middleware(validatorOptions));
  
  server.use("/api/v1/auth", authRouter);
  server.use("/api/v1/vehicles", vehiclesRouter);
  server.use("/api/v1/users", usersRouter);

  // error customization, if request is invalid
  server.use((err: object, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(Number(err["status"]) || 500).json({
      error: {
        type: "request_validation",
        message: err["message"] as string,
        errors: err["errors"] as object,
      },
    });
    next();
  });
  return server;
}

export { createServer };
