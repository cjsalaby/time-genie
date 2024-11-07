'use strict';
const {DataTypes, Sequelize} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timesheet', {
      timesheet_id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emp_id: {
        type: Sequelize.UUIDV4
      },
      clock_in_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      clock_out_time: {
        type: Sequelize.DATE
      },
      clock_in_location: {
        type: Sequelize.literal('POINT'),
      },
      clock_out_location: {
        type: Sequelize.literal('POINT'),
      },
      clock_in_region: {
        type: Sequelize.BOOLEAN
      },
      clock_out_region: {
        type: Sequelize.BOOLEAN
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'project',
          key: 'project_id'
        }
      },
      clock_in_is_approved: {
        type: Sequelize.BOOLEAN
      },
      clock_out_is_approved: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timesheet');
  }
};
