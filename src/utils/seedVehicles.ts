import { Vehicle } from "../models/vehicle.js";
import { sequelize } from "../config/dbConnection.js";
import vehicleData from "../../mock/vehicles.json" with { type: "json" };
import config from "../config/env.js";

async function seedVehicles() {
  try {
    // Authenticate with database
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ [config.DB_SYNC_POLICY]: true });
    console.log("Database synchronized");

    // Check if vehicles already exist
    const existingVehicles = await Vehicle.count();
    if (existingVehicles > 0) {
      console.log("Vehicles already exist in database. Skipping seeding.");
      return;
    }

    // Create vehicles from JSON data
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createdVehicles = await Vehicle.bulkCreate(vehicleData, {
      returning: true,
    });

    console.log(`Successfully seeded ${createdVehicles.length} vehicles`);
  } catch (error) {
    console.error("Error seeding vehicles:", error);
  }
}

await seedVehicles();

export { seedVehicles };
