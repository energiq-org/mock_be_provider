"use strict";

/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure OTP code is CHAR(6) for exactly 6 characters
    await queryInterface.changeColumn("otps", "code", {
      type: Sequelize.CHAR(6),
      allowNull: false,
    });

    // Add unique constraint on phone_number in users table (if not exists)
    try {
      await queryInterface.addIndex("users", ["phone_number"], {
        unique: true,
        name: "users_phone_number_unique_v2",
        where: {
          phone_number: {
            [Sequelize.Op.ne]: null,
          },
        },
      });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("already exists")) {
        throw error;
      }
      console.log("Phone number unique constraint already exists, skipping...");
    }

    // Add check constraint to ensure OTP code is exactly 6 digits (if not exists)
    try {
      await queryInterface.addConstraint("otps", {
        fields: ["code"],
        type: "check",
        name: "otps_code_6_digits_check",
        where: {
          code: {
            [Sequelize.Op.regexp]: "^[0-9]{6}$",
          },
        },
      });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("already exists")) {
        throw error;
      }
      console.log("OTP code numeric constraint already exists, skipping...");
    }

    // Update user_vehicles connector_type to ENUM (if not already done)
    try {
      await queryInterface.changeColumn("user_vehicles", "connector_type", {
        type: Sequelize.ENUM("Type 1", "Type 2", "CCS1", "CCS2", "CHAdeMO", "GB/T", "Tesla"),
        allowNull: false,
      });
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("enum")) {
        throw error;
      }
      console.log("Connector type ENUM already exists, skipping...");
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert OTP code back to STRING(6)
    await queryInterface.changeColumn("otps", "code", {
      type: Sequelize.STRING(6),
      allowNull: false,
    });

    // Remove unique constraint on phone_number
    try {
      await queryInterface.removeIndex("users", "users_phone_number_unique_v2");
    } catch  {
      console.log("Phone number constraint removal failed, might not exist");
    }

    // Remove OTP code constraint
    try {
      await queryInterface.removeConstraint("otps", "otps_code_6_digits_check");
    } catch {
      console.log("OTP constraint removal failed, might not exist");
    }

    // Revert user_vehicles connector_type back to STRING
    try {
      await queryInterface.changeColumn("user_vehicles", "connector_type", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    } catch {
      console.log("Connector type reversion failed");
    }
  },
};
