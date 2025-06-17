"use strict";

/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vehicles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      availability: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      range: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      efficiency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      acceleration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      one_stop_range: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      battery: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fastcharge: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      towing: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cargo_volume: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
 // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("vehicles");
  },
};
