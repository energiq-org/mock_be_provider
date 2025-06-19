import { Vehicle } from "../models/vehicle.js";
import { AppDataSource } from "../config/dbConnection.js";
import vehicleData from "../../mock/vehicles.json" with { type: "json" };

async function seedVehicles() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log("Database connection established");

    // Check if vehicles already exist
    const existingVehicles = await Vehicle.count();
    if (existingVehicles > 0) {
      console.log("Vehicles already exist in database. Skipping seeding.");
      return;
    }

    // Create vehicles from JSON data
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const createdVehicles = await vehicleRepository.save(vehicleData);

    console.log(`Successfully seeded ${createdVehicles.length} vehicles`);
  } catch (error) {
    console.error("Error seeding vehicles:", error);
  }
}

await seedVehicles();

export { seedVehicles };