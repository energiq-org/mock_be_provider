import { Station, StationStatus } from "../models/station.js";
import { AppDataSource } from "../config/dbConnection.js";

const stationsData = [
    {
        name: "Zarvak Hub",
        location: "Sheikh Zayed, Giza, Egypt",
        status: StationStatus.ONLINE,
        power: "150 kW",
        active_sessions: 3,
        total_sessions: 245,
        alerts_count: 0,
        latitude: 30.0444,
        longitude: 31.2357,
        last_seen: new Date(),
        chargers_count: 4,
        connectors_count: 8,
        total_energy_delivered: 15240.50,
        total_revenue: 45720.00,
    },
    {
        name: "Central Station",
        location: "Downtown Cairo, Egypt",
        status: StationStatus.ONLINE,
        power: "200 kW",
        active_sessions: 2,
        total_sessions: 398,
        alerts_count: 1,
        latitude: 30.0626,
        longitude: 31.2497,
        last_seen: new Date(),
        chargers_count: 6,
        connectors_count: 12,
        total_energy_delivered: 28750.25,
        total_revenue: 86250.75,
    },
    {
        name: "Mall Plaza",
        location: "Citystars Mall, Cairo",
        status: StationStatus.OFFLINE,
        power: "100 kW",
        active_sessions: 0,
        total_sessions: 156,
        alerts_count: 2,
        latitude: 30.0733,
        longitude: 31.3400,
        last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        chargers_count: 3,
        connectors_count: 6,
        total_energy_delivered: 8920.75,
        total_revenue: 26762.25,
    },
    {
        name: "Tech Park",
        location: "New Capital, Egypt",
        status: StationStatus.DEGRADED,
        power: "75 kW",
        active_sessions: 1,
        total_sessions: 89,
        alerts_count: 1,
        latitude: 30.0131,
        longitude: 31.4914,
        last_seen: new Date(),
        chargers_count: 2,
        connectors_count: 4,
        total_energy_delivered: 4560.00,
        total_revenue: 13680.00,
    },
    {
        name: "Green Valley",
        location: "6th October City, Egypt",
        status: StationStatus.ONLINE,
        power: "120 kW",
        active_sessions: 4,
        total_sessions: 203,
        alerts_count: 0,
        latitude: 29.9097,
        longitude: 31.0095,
        last_seen: new Date(),
        chargers_count: 3,
        connectors_count: 6,
        total_energy_delivered: 12340.80,
        total_revenue: 37022.40,
    },
    {
        name: "Airport Terminal",
        location: "Cairo International Airport",
        status: StationStatus.ONLINE,
        power: "180 kW",
        active_sessions: 1,
        total_sessions: 142,
        alerts_count: 0,
        latitude: 30.1219,
        longitude: 31.4056,
        last_seen: new Date(),
        chargers_count: 4,
        connectors_count: 8,
        total_energy_delivered: 9876.40,
        total_revenue: 29629.20,
    },
    {
        name: "University Campus",
        location: "Cairo University, Giza",
        status: StationStatus.ONLINE,
        power: "90 kW",
        active_sessions: 2,
        total_sessions: 187,
        alerts_count: 0,
        latitude: 30.0277,
        longitude: 31.2085,
        last_seen: new Date(),
        chargers_count: 3,
        connectors_count: 6,
        total_energy_delivered: 11234.60,
        total_revenue: 33703.80,
    },
    {
        name: "Hotel District",
        location: "Zamalek, Cairo",
        status: StationStatus.DEGRADED,
        power: "110 kW",
        active_sessions: 0,
        total_sessions: 98,
        alerts_count: 1,
        latitude: 30.0618,
        longitude: 31.2194,
        last_seen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        chargers_count: 2,
        connectors_count: 4,
        total_energy_delivered: 5432.10,
        total_revenue: 16296.30,
    },
    {
        name: "Business Hub",
        location: "New Cairo, Egypt",
        status: StationStatus.ONLINE,
        power: "160 kW",
        active_sessions: 3,
        total_sessions: 312,
        alerts_count: 0,
        latitude: 30.0254,
        longitude: 31.4919,
        last_seen: new Date(),
        chargers_count: 5,
        connectors_count: 10,
        total_energy_delivered: 18765.90,
        total_revenue: 56297.70,
    },
    {
        name: "Riverside Park",
        location: "Maadi, Cairo",
        status: StationStatus.ONLINE,
        power: "85 kW",
        active_sessions: 1,
        total_sessions: 134,
        alerts_count: 0,
        latitude: 29.9602,
        longitude: 31.2569,
        last_seen: new Date(),
        chargers_count: 2,
        connectors_count: 4,
        total_energy_delivered: 7890.25,
        total_revenue: 23670.75,
    }
];

async function seedStations() {
    try {
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log("Database connection established for stations seeding");

        // Check if stations already exist
        const existingStations = await Station.count();
        if (existingStations > 0) {
            console.log("Stations already exist in database. Skipping seeding.");
            return;
        }

        // Create stations from data
        const stationRepository = AppDataSource.getRepository(Station);
        const createdStations = await stationRepository.save(stationsData);

        console.log(`Successfully seeded ${createdStations.length} stations`);
        return createdStations;
    } catch (error) {
        console.error("Error seeding stations:", error);
        throw error;
    }
}

export { seedStations, stationsData }; 