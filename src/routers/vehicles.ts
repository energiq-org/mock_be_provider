import { Router } from "express";
import { query } from "express-validator";
import { getVehicleController } from "../controllers/vehicles/index.ts";
import { validateRequest } from "../middlewares/validator.ts";

const vehiclesRouter = Router();

vehiclesRouter.get(
  "/",
  query("id").isInt().optional(),
  query("model").isString().optional(),
  validateRequest,
  getVehicleController
);

export { vehiclesRouter };
