'use strict';
const { Sequelize, DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
const employeeRoles = ['OFFICE', 'REMOTE', 'FIELD', 'REPAIR', 'MANAGER'];
const employeeTypes = ['FULLTIME', 'PARTTIME']

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employee', {
      emp_id: {
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
        type: Sequelize.UUID
        },
        manager_id: {
            type: Sequelize.UUID
        },
      company_name: {
        type: Sequelize.STRING
      },
        first_name: {
            allowNull: false,
        type: Sequelize.STRING
      },
        last_name: {
            allowNull: false,
        type: Sequelize.STRING
      },
        username: {
            allowNull: false,
        type: Sequelize.STRING
      },
        email: {
          type: Sequelize.STRING
        },
        password: {
            allowNull: false,
        type: Sequelize.STRING
      },
        roles: {
            allowNull: false,
            type: DataTypes.ARRAY(DataTypes.ENUM(employeeRoles))
      },
        employment_type: {
            allowNull: false,
            type: DataTypes.ENUM(employeeTypes)
      },
        max_breaks: {
          allowNull: false,
            type: DataTypes.INTEGER
        },
        breaks_remaining: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        break_duration: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        created_at: {
            defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
        updated_at: {
            defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
      timezone: {
        type: Sequelize.FLOAT
      }
    });
  },
  async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('employee');
  }
};
