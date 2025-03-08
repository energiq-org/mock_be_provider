import { Router } from "express";
import { getVehicleController } from "../controllers/vehicles/index.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import { getVehicleSchema } from "../schemas/vehicles.ts";
const vehiclesRouter = Router();

vehiclesRouter.get("/", arktypeRequestValidator(getVehicleSchema, "query"), getVehicleController);

export { vehiclesRouter };
