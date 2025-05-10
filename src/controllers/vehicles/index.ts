import { Request, Response } from "express";
import { fuzzySearcher, Vehicle } from "../../utils/vehiclesStore.js";
import { getVehiclesQueryParamsSchema } from "../../schemas/controllers/vehicles/get/vehicles.js";
import { Static } from "@sinclair/typebox";

function getVehicleController(
  req: Request<unknown, unknown, unknown, Static<typeof getVehiclesQueryParamsSchema>>,
  res: Response
) {
  try {
    const { id, model } = req.query;

    let response: Vehicle[] | Vehicle | undefined;
    if (id !== undefined) {
      response = fuzzySearcher.findById(parseInt(id.toString())) ?? [];
    } else if (model !== undefined) {
      response = fuzzySearcher.find({ model });
    } else {
      response = fuzzySearcher.list();
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { getVehicleController };
