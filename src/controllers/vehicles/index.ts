import { Request, Response } from "express";
import { fuzzySearcher, Vehicle } from "../../utils/vehiclesStore.ts";
import { getVehicleSchema } from "../../schemas/vehicles.ts";
function getVehicleController(req: Request<unknown, unknown, unknown, typeof getVehicleSchema.infer>, res: Response) {
  try {
    const { id, model } = req.query;

    let response: Vehicle[] | Vehicle | undefined;
    if (id !== undefined) {
      response = fuzzySearcher.findById(parseInt(id)) ?? [];
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
