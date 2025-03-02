import { UUID } from "crypto";
import { Request, Response } from "express";
import { UserVehicle } from "../../models/userVehicles.ts";
import { fuzzySearcher } from "../../utils/vehiclesStore.ts";

async function addUserVehicleController(req: Request, res: Response) {
  const userId = req["userId"] as UUID;
  const { vehicle_id } = req.body as { vehicle_id: number };

  try {
    const vehicle = fuzzySearcher.findById(vehicle_id);
    if (!vehicle) {
      return res.status(400).json({ msg: "vehicle not found" });
    }

    await UserVehicle.create({
      user_id: userId,
      vehicle_id,
    });

    return res.status(201).json({ msg: "Vehicle added successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { addUserVehicleController };
