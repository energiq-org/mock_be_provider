import { Request, Response } from "express";
import { Static } from "@sinclair/typebox";
import { getStationsQueryParamsSchema } from "../../schemas/controllers/dashboard/dashboard.js";

function getStationsController(
    req: Request<unknown, unknown, unknown, Static<typeof getStationsQueryParamsSchema>>,
    res: Response
) {
    try {
        const { status, limit = 50, offset = 0 } = req.query;

        // Mock station data that matches frontend expectations
        const mockStations = [
            {
                id: 1,
                name: "Zarvak Hub",
                location: "Sheikh Zayed, Giza, Egypt",
                status: "Online",
                power: "150 kW",
                active_sessions: 3,
                total_sessions: 245,
                alerts_count: 0,
                latitude: 30.0444,
                longitude: 31.2357,
                last_seen: new Date().toISOString(),
                chargers_count: 4,
                connectors_count: 8,
                total_energy_delivered: 15240.50,
                total_revenue: 45720.00,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 2,
                name: "Central Station",
                location: "Downtown Cairo, Egypt",
                status: "Online",
                power: "200 kW",
                active_sessions: 2,
                total_sessions: 398,
                alerts_count: 1,
                latitude: 30.0626,
                longitude: 31.2497,
                last_seen: new Date().toISOString(),
                chargers_count: 6,
                connectors_count: 12,
                total_energy_delivered: 28750.25,
                total_revenue: 86250.75,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 3,
                name: "Mall Plaza",
                location: "Citystars Mall, Cairo",
                status: "Offline",
                power: "100 kW",
                active_sessions: 0,
                total_sessions: 156,
                alerts_count: 2,
                latitude: 30.0733,
                longitude: 31.3400,
                last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                chargers_count: 3,
                connectors_count: 6,
                total_energy_delivered: 8920.75,
                total_revenue: 26762.25,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 4,
                name: "Tech Park",
                location: "New Capital, Egypt",
                status: "Degraded",
                power: "75 kW",
                active_sessions: 1,
                total_sessions: 89,
                alerts_count: 1,
                latitude: 30.0131,
                longitude: 31.4914,
                last_seen: new Date().toISOString(),
                chargers_count: 2,
                connectors_count: 4,
                total_energy_delivered: 4560.00,
                total_revenue: 13680.00,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 5,
                name: "Green Valley",
                location: "6th October City, Egypt",
                status: "Online",
                power: "120 kW",
                active_sessions: 4,
                total_sessions: 203,
                alerts_count: 0,
                latitude: 29.9097,
                longitude: 31.0095,
                last_seen: new Date().toISOString(),
                chargers_count: 3,
                connectors_count: 6,
                total_energy_delivered: 12340.80,
                total_revenue: 37022.40,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        ];

        // Filter by status if provided
        let filteredStations = mockStations;
        if (status) {
            filteredStations = mockStations.filter(station => station.status === status);
        }

        // Apply pagination
        const paginatedStations = filteredStations.slice(offset, offset + limit);

        return res.status(200).json({
            data: paginatedStations,
            total: filteredStations.length,
            limit,
            offset
        });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

function createStationController(req: Request, res: Response) {
    try {
        // Mock station creation
        const newStation = {
            id: Date.now(), // Simple ID generation for mock
            ...req.body,
            active_sessions: 0,
            total_sessions: 0,
            alerts_count: 0,
            total_energy_delivered: 0,
            total_revenue: 0,
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        
        return res.status(201).json({ 
            msg: "Station created successfully", 
            data: newStation 
        });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

function updateStationController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Mock station update
        const updatedStation = {
            id: parseInt(id),
            ...req.body,
            updated_at: new Date().toISOString(),
        };
        
        return res.status(200).json({ 
            msg: "Station updated successfully", 
            data: updatedStation 
        });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

function deleteStationController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        return res.status(200).json({ 
            msg: `Station ${id} deleted successfully` 
        });
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message });
    }
}

export { getStationsController, createStationController, updateStationController, deleteStationController }; 