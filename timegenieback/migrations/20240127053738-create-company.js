'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company', {
        name: {
            allowNull: false,
            unique: true,
            primaryKey: true,
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
        address1: {
            allowNull: false,
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
        city: {
            allowNull: false,
        type: Sequelize.STRING
      },
        state: {
            allowNull: false,
        type: Sequelize.STRING
      },
        country: {
            allowNull: false,
        type: Sequelize.STRING
      },
        postalcode: {
            allowNull: false,
        type: Sequelize.STRING
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
        timezone: {
            type: Sequelize.STRING
        },
        clockOutCronExpression: {
            type: Sequelize.STRING
        }
    });
  },
  async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('company');
  }
};
