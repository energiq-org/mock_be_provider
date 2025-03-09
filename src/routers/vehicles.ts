import { Router } from "express";
import { getVehicleController } from "../controllers/vehicles/index.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import { getVehicleSchema } from "../schemas/vehicles.ts";
import { docs } from "../docs/index.ts";
import { generateQueryRequestBody, getErrorResponses } from "../docs/helpers.ts";
import { generateJSONResponse } from "../docs/helpers.ts";
import { successResponseSchema } from "../schemas/common-responses.ts";
const vehiclesRouter = Router();

vehiclesRouter.get(
  "/",
  docs.path({
    summary: "Get vehicle",
    description: "Get vehicle",
    tags: ["vehicles"],
    parameters: generateQueryRequestBody(getVehicleSchema),
    responses: {
      200: generateJSONResponse(successResponseSchema, "The vehicle was retrieved successfully"),
      ...getErrorResponses(["500"]),
    },
  }),
  arktypeRequestValidator(getVehicleSchema, "query"),
  getVehicleController
);

export { vehiclesRouter };
