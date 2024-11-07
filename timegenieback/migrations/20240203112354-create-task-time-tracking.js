'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskTimeTracking', {
      tracking_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: Sequelize.UUIDV4,
        references: {
          model: 'employee',
          key: 'emp_id'
        }
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'task',
          key: 'task_id',
        }
      },
      project_time_tracking_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projecttimetracking',
          key: 'tracking_id'
        }
      },
      time_spent: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskTimeTracking');
  }
};