import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { getVehiclesQueryParamsSchema } from "../../schemas/controllers/vehicles/vehicles.js";
import { Vehicle } from "../../models/vehicle.js";

async function getVehiclesController(
    req: Request<unknown, unknown, unknown, Static<typeof getVehiclesQueryParamsSchema>>,
    res: Response
) {
    try {
        const { id, model } = req.query;

        let vehicles;

        if (id !== undefined && id !== null) {
            const vehicle = await Vehicle.findOne({ where: { id: Number(id) } });
            vehicles = vehicle ? [vehicle] : [];
        } else if (model !== undefined && model !== null && model !== "") {
            vehicles = await Vehicle.find({
                where: {
                    model: model
                }
            });
        } else {
            vehicles = await Vehicle.find();
        }

        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function createVehicleController(req: Request, res: Response) {
    try {
        const vehicle = new Vehicle();
        Object.assign(vehicle, req.body);
        await vehicle.save();
        
        return res.status(201).json({ msg: "Vehicle created successfully", data: vehicle });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function updateVehicleController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findOne({ where: { id: Number(id) } });
        
        if (!vehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        Object.assign(vehicle, req.body);
        await vehicle.save();
        
        return res.status(200).json({ msg: "Vehicle updated successfully", data: vehicle });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

async function deleteVehicleController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findOne({ where: { id: Number(id) } });
        
        if (!vehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        await vehicle.remove();
        
        return res.status(200).json({ msg: "Vehicle deleted successfully" });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { getVehiclesController, createVehicleController, updateVehicleController, deleteVehicleController };
