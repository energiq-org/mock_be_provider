import { UUID } from "crypto";
import { Request, Response } from "express";
import { vehicleIdSchema } from "../../schemas/userVehicles.js";
import { Static } from "@sinclair/typebox";
import { UserVehicle } from "../../models/userVehicle.js";
import { addUserVehicleSchema } from "../../schemas/controllers/users/userVehicles.js";
import { ForeignKeyConstraintError } from "sequelize";
import { updateUserVehicleSchema } from "../../schemas/controllers/users/userVehicles.js";
async function addUserVehicleController(
  req: Request<unknown, unknown, Static<typeof addUserVehicleSchema>>,
  res: Response
) {
  try {
    const userId = req["userId"] as UUID;
    const vehicleId = req.body.id;

    await UserVehicle.create({
      user_id: userId,
      vehicle_id: vehicleId,
      connector_type: req.body.connector_type,
      actual_battery: req.body.actual_battery,
    });

    return res.status(201).json({ msg: "Vehicle added successfully" });
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(404).json({ msg: "double check the vehicle id" });
    }
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function deleteUserVehicleController(req: Request<Static<typeof vehicleIdSchema>>, res: Response) {
  try {
    const vehicleId = req.params.id;

    const result = await UserVehicle.destroy({
      where: {
        id: vehicleId,
      },
    });

    if (!result) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    return res.status(200).json({ msg: "Vehicle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

async function updateUserVehicleController(
  req: Request<Static<typeof vehicleIdSchema>, unknown, Static<typeof updateUserVehicleSchema>>,
  res: Response
) {
  try {
    const vehicleId = req.params.id;
    const updateData = req.body;

    const [affectedCount] = await UserVehicle.update(updateData, {
      where: {
        id: vehicleId,
      },
    });

    if (!affectedCount) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    return res.status(200).json({ msg: "Vehicle updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: (error as Error).message });
  }
}

export { addUserVehicleController, deleteUserVehicleController, updateUserVehicleController };
