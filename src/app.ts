import bodyParser from "body-parser";
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { Express } from "express-serve-static-core";
import morgan from "morgan";
import morganBody from "morgan-body";
import { summarise } from "swagger-routes-express";
import YAML from "yamljs";
import config from "./config/env";
import { helloRouter } from "./routers/greeting";
import logger from "./utils/logging";

function createServer(): Express {
  const yamlSpecFile = "./openapi.yml";
  const apiDefinition = YAML.load(yamlSpecFile) as object;
  const apiSummary = summarise(apiDefinition);
  logger.info(apiSummary);
  const server = express();
  server.use(bodyParser.json());

  if (config.HTTP_LOGGING) {
    server.use(morgan("dev"));
  }

  if (config.HTTP_BODY_LOGGING) {
    morganBody(server);
  }

  // setup API validator
  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: config.SPEC_REQUEST_VALIDATION,
    validateResponses: config.SPEC_RESPONSE_VALIDATION,
  };

  server.use(OpenApiValidator.middleware(validatorOptions));

  server.use("/api/v1", helloRouter);

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
