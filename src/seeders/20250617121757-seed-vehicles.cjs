/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
"use strict";

const fs = require("fs");
const path = require("path");

// Read the vehicles data from JSON file
const vehiclesData = JSON.parse(fs.readFileSync(path.join(__dirname, "../../mock/vehicles.json"), "utf8"));

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if vehicles already exist
    const existingVehicles = await queryInterface.sequelize.query("SELECT COUNT(*) as count FROM vehicles", {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (existingVehicles[0].count > 0) {
      console.log("Vehicles already exist in database. Skipping seeding.");
      return;
    }

    // Add created_at timestamp to each vehicle
    const vehiclesWithTimestamp = vehiclesData.map((vehicle) => ({
      ...vehicle,
      created_at: new Date(),
    }));

    // Insert vehicles data
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await queryInterface.bulkInsert("vehicles", vehiclesWithTimestamp, {});

    console.log(`Successfully seeded ${vehiclesWithTimestamp.length} vehicles`);
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    // Remove all vehicles that were seeded
    await queryInterface.bulkDelete("vehicles", null, {});
    console.log("All vehicles have been removed");
  },
};
