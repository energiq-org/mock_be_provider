import { Router } from "express";
import { getVehicleController } from "../controllers/vehicles/index.js";
import { arktypeRequestValidator } from "../middlewares/validator.js";
import { docs } from "../docs/index.js";
import { generateRequestParameters, getErrorResponses } from "../docs/helpers.js";
import { generateJSONResponse } from "../docs/helpers.js";
import { successResponseSchema } from "../schemas/common-responses.js";
import { getVehiclesQueryParamsSchema } from "../schemas/controllers/vehicles/vehicles.js";
const vehiclesRouter = Router();

vehiclesRouter.get(
  "/",
  docs.path({
    summary: "Get vehicle",
    description: "Get vehicle",
    tags: ["vehicles"],
    parameters: generateRequestParameters(getVehiclesQueryParamsSchema, "query"),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The vehicle was retrieved successfully"),
      ...getErrorResponses(["500"]),
    },
  }),
  arktypeRequestValidator(getVehiclesQueryParamsSchema, "query"),
  getVehicleController
);

export { vehiclesRouter };
