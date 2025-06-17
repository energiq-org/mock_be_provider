"use strict";

/** @type {import("sequelize-cli").Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("webhooks", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      success: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("webhooks");
  },
};
