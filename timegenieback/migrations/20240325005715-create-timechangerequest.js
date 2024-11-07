'use strict';
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timechangerequest', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emp_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'employee',
          key: 'emp_id'
        }
      },
      timesheet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'timesheet',
          key: 'timesheet_id'
        }
      },
      description: {
        type: Sequelize.STRING
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
      },
      created_at: {
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
      updated_at: {
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timechangerequest');
  }
};
