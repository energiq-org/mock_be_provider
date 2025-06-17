"use strict";

/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {  
  async up(queryInterface, Sequelize) {
    // First add the new type column
    await queryInterface.addColumn("verification_codes", "type", {
      type: Sequelize.ENUM("verification", "reset_password"),
      allowNull: false,
      defaultValue: "verification", // Set a default value for existing records
    });

    // Then rename the table
    await queryInterface.renameTable("verification_codes", "otps");
  },

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // First rename the table back
    await queryInterface.renameTable("otps", "verification_codes");

    // Then remove the type column
    await queryInterface.removeColumn("verification_codes", "type");
  },
};
