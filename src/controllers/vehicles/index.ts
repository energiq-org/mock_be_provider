import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { getVehiclesQueryParamsSchema } from "../../schemas/controllers/vehicles/vehicles.js";
import { VehicleSchemaType } from "../../schemas/vehicles.js";
import { Vehicle } from "../../models/vehicle.js";
import { AppDataSource } from "../../config/dbConnection.js";

async function getVehicleController(
    req: Request<unknown, unknown, unknown, Static<typeof getVehiclesQueryParamsSchema>>,
    res: Response
) {
    try {
        const vehicleRepository = AppDataSource.getRepository(Vehicle);
        let vehicles: VehicleSchemaType[] = [];

        if (req.query.id !== undefined) {
            const vehicle = await vehicleRepository.findOne({ where: { id: req.query.id } });
            vehicles = vehicle ? [vehicle] : [];
        } else if (req.query.model !== undefined) {
            vehicles = req.app.locals.fuzzySearcher.search({ model: req.query.model });
        } else {
            vehicles = await vehicleRepository.find();
        }
        res.status(200).json(vehicles);
        return;
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message });
        return;
    }
}

export { getVehicleController };
