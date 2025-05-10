import { Router } from "express";
import { getVehicleController } from "../controllers/vehicles/index.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses } from "../docs/helpers.js";
import { generateJSONResponse } from "../docs/helpers.js";
import { getVehiclesQueryParamsSchema } from "../schemas/controllers/vehicles/get/vehicles.js";
import { ajvRequestValidator } from "../middlewares/validator.js";
import { vehicleSchema } from "../schemas/vehicles.js";
import { Type } from "@sinclair/typebox";

const vehiclesRouter = Router();

vehiclesRouter.get(
  "/",
  docs.path({
    summary: "Get vehicle",
    description: "Get vehicle",
    tags: ["vehicles"],
    parameters: generateRequestParameters(getVehiclesQueryParamsSchema, "query"),
    responses: {
      200: generateJSONResponse(Type.Array(vehicleSchema), "The vehicle was retrieved successfully"),
      ...getErrorResponses(["500"]),
    },
  }),
  ajvRequestValidator(getVehiclesQueryParamsSchema, "query"),
  getVehicleController
);

export { vehiclesRouter };
