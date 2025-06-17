"use strict";

/** @type {import("sequelize-cli").Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "success", "failed"),
        allowNull: false,
      },
      amount: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      session_kw: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      vehicle_id: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("transactions");
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_transactions_status";`);
  },
};
