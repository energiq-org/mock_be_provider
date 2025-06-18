/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {
    // Drop the unique constraint that prevents duplicate user-vehicle pairs
    await queryInterface.removeIndex("user_vehicles", "user_vehicles_user_id_vehicle_id_unique");
  },

  async down(queryInterface, Sequelize) {
    // Re-add the unique constraint if we need to rollback
    await queryInterface.addIndex("user_vehicles", ["user_id", "vehicle_id"], {
      unique: true,
      name: "user_vehicles_user_id_vehicle_id_unique",
    });
  },
};
