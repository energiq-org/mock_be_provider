import { UUID } from "crypto";
import { Request, Response } from "express";
import { vehicleIdSchema } from "../../schemas/userVehicles.js";
import { Static } from "@sinclair/typebox";
import { UserVehicle } from "../../models/userVehicle.js";
import { addUserVehicleSchema } from "../../schemas/controllers/users/userVehicles.js";
import { updateUserVehicleSchema } from "../../schemas/controllers/users/userVehicles.js";
import { AppDataSource } from "../../config/dbConnection.js";
import { QueryFailedError } from "typeorm";

async function addUserVehicleController(
    req: Request<unknown, unknown, Static<typeof addUserVehicleSchema>>,
    res: Response
) {
    try {
        const userId = req["userId"] as UUID;
        const vehicleId = req.body.vehicle_id;

        const userVehicleRepository = AppDataSource.getRepository(UserVehicle);
        const userVehicle = userVehicleRepository.create({
            user_id: userId,
            vehicle_id: vehicleId,
            connector_type: req.body.connector_type,
            actual_battery: req.body.actual_battery,
        });
        await userVehicleRepository.save(userVehicle);

        return res.status(201).json({ msg: "Vehicle added successfully" });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            return res.status(404).json({ msg: "double check the vehicle id" });
        }
        console.log(error);
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function deleteUserVehicleController(req: Request<Static<typeof vehicleIdSchema>>, res: Response) {
    try {
        const vehicleId = req.params.id;

        const userVehicle = await UserVehicle.findOne({
            where: {
                id: vehicleId,
            },
        });

        if (!userVehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        await UserVehicle.delete(userVehicle.id);

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

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ msg: "no data to update" });
        }

        const userVehicleRepository = AppDataSource.getRepository(UserVehicle);
        const userVehicle = await userVehicleRepository.findOne({ where: { id: vehicleId } });

        if (!userVehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        Object.assign(userVehicle, updateData);
        await userVehicleRepository.save(userVehicle);

        return res.status(200).json({ msg: "Vehicle updated successfully" });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { addUserVehicleController, deleteUserVehicleController, updateUserVehicleController };
