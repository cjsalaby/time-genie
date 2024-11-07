'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('breaks', {
        break_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employee_id: {
            type: Sequelize.UUID,
            references: {
                model: 'employee',
                key: 'emp_id'
            }
        },
        start_time: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
            allowNull: false
        },
        stop_time: {
            type: Sequelize.DATE
        },
        total_time_spent: {
            type: Sequelize.INTEGER
        },
        in_progress: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            defaultValue: Sequelize.fn('NOW'),
            allowNull: false,
            type: Sequelize.DATE
        },
        updated_at: {
            defaultValue: Sequelize.fn('NOW'),
            allowNull: false,
            type: Sequelize.DATE
        },
        deleted_at: {
            type: Sequelize.DATE,
        }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('breaks');
  }
};