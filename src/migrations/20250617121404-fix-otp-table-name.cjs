"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the table from otp to otps
    await queryInterface.renameTable("otp", "otps");
  },

  async down(queryInterface, Sequelize) {
    // Rename back from otps to otp
    await queryInterface.renameTable("otps", "otp");
  },
};
