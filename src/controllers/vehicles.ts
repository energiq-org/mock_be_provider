import { Request, Response } from "express";
import { fuzzySearcher } from "../utils/vehiclesStore";

function getVehicleController(req: Request, res: Response) {
  const { id, model } = req.query as { id?: string; model?: string };

  if (id !== undefined) {
    const vehicle = fuzzySearcher.findById(parseInt(id));
    if (vehicle) {
      return res.json(vehicle);
    }
    return res.status(404).json({ message: "vehicle not found" });
  }

  if (model !== undefined) {
    const vehicles = fuzzySearcher.find({ model });
    return res.json(vehicles);
  }

  const vehicles = fuzzySearcher.list();
  return res.json(vehicles);
}

export { getVehicleController };
