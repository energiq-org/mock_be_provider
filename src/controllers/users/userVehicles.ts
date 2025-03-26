import { UUID } from "crypto";
import { Request, Response } from "express";
import { UserVehicle } from "../../models/userVehicles.ts";
import { fuzzySearcher } from "../../utils/vehiclesStore.ts";
import { vehicleIdSchema } from "../../schemas/vehicles.ts";
import { User } from "../../models/user.ts";

async function addUserVehicleController(
  req: Request<typeof vehicleIdSchema.infer, unknown, unknown, unknown>,
  res: Response
) {
  try {
    const userId = req["userId"] as UUID;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const vehicleId = Number(req.params.id);
    const vehicle = fuzzySearcher.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ msg: "vehicle not found" });
    }

    await UserVehicle.create({
      user_id: userId,
      vehicle_id: vehicleId,
    });

    return res.status(201).json({ msg: "Vehicle added successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function deleteUserVehicleController(
  req: Request<typeof vehicleIdSchema.infer, unknown, unknown, unknown>,
  res: Response
) {
  try {
    const userId = req["userId"] as UUID;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const vehicleId = Number(req.params.id);
    if (isNaN(vehicleId)) {
      return res.status(400).json({ msg: "Invalid vehicle ID" });
    }

    const vehicle = await UserVehicle.findOne({
      where: { vehicle_id: vehicleId, user_id: userId },
    });

    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found or not owned by the user" });
    }

    await vehicle.destroy();
    return res.status(200).json({ msg: "Vehicle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { addUserVehicleController, deleteUserVehicleController };
