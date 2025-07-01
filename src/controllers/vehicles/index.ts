import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { getVehiclesQueryParamsSchema } from "../../schemas/controllers/vehicles/vehicles.js";
// import { VehicleSchemaType } from "../../schemas/vehicles.js";

function getVehicleController(
    req: Request<unknown, unknown, unknown, Static<typeof getVehiclesQueryParamsSchema>>,
    res: Response
) {
    try {
        const vehicles = req.app.locals.fuzzySearcher.search(req.query);
        return res.status(200).json(vehicles);
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { getVehicleController };
