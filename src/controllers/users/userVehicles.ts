import { UUID } from "crypto";
import { Request, Response } from "express";
import { UserVehicle } from "../../models/userVehicles.ts";
import { fuzzySearcher } from "../../utils/vehiclesStore.ts";
import { addVehicleSchema } from "../../schemas/vehicles.ts";
import { User } from "../../models/user.ts";

async function addUserVehicleController(req: Request<unknown, unknown, typeof addVehicleSchema.infer>, res: Response) {
  try {
    const userId = req["userId"] as UUID;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const { vehicle_id } = req.body;
    const vehicle = fuzzySearcher.findById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ msg: "vehicle not found" });
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
