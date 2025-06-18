"use strict";

/** @type {import('sequelize-cli').Migration} */
// eslint-disable-next-line no-undef
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update users table: Change profile_picture to allow NULL
    await queryInterface.changeColumn("users", "profile_picture", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Update user_vehicles table: Change connector_type from STRING to ENUM
    await queryInterface.changeColumn("user_vehicles", "connector_type", {
      type: Sequelize.ENUM("Type 1", "Type 2", "CCS1", "CCS2", "CHAdeMO", "GB/T", "Tesla"),
      allowNull: false,
    });

    // Ensure OTP code is CHAR(6) for consistency
    await queryInterface.changeColumn("otps", "code", {
      type: Sequelize.CHAR(6),
      allowNull: false,
    });

    // Add unique constraint on phone_number in users table (if not exists)
    try {
      await queryInterface.addIndex("users", ["phone_number"], {
        unique: true,
        name: "users_phone_number_unique",
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
      console.log("Index users_phone_number_unique already exists, skipping...");
    }

    // Add check constraint to ensure OTP code is exactly 6 digits (if not exists)
    try {
      await queryInterface.addConstraint("otps", {
        fields: ["code"],
        type: "check",
        name: "otps_code_numeric_check",
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
      console.log("Constraint otps_code_numeric_check already exists, skipping...");
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert users table: Change profile_picture back to NOT NULL
    await queryInterface.changeColumn("users", "profile_picture", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // Remove unique constraint on phone_number
    await queryInterface.removeIndex("users", "users_phone_number_unique");

    // Revert user_vehicles table: Change connector_type back to STRING
    await queryInterface.changeColumn("user_vehicles", "connector_type", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove the ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_vehicles_connector_type";');

    // Remove OTP code constraint
    await queryInterface.removeConstraint("otps", "otps_code_numeric_check");
  },
};
