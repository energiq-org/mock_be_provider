import { Request, Response } from "express";
import { fuzzySearcher, Vehicle } from "../utils/vehiclesStore";

function getVehicleController(req: Request, res: Response) {
  const { id, model } = req.query as { id?: string; model?: string };

  let response: Vehicle[] | Vehicle | null = null;

  if (id !== undefined) {
    response = fuzzySearcher.findById(parseInt(id));
  } else if (model !== undefined) {
    response = fuzzySearcher.find({ model });
  } else {
    response = fuzzySearcher.list();
  }
  return res.json(response);
}

export { getVehicleController };
