const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db/db');
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const company = sequelize.define('company', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.STRING(15),
        },
        email: {
            type: DataTypes.STRING(255),
        },
        description: {
            type: DataTypes.TEXT,
        },
        address1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address2: {
            type: DataTypes.STRING(255),
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        country: {
            type: DataTypes.CHAR(2),
            allowNull: false,
        },
        postalcode: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING(32)
        },
        clockoutcronexpression: {
            type: Sequelize.STRING(32)
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
    },
    {
        sequelize,
        paranoid: true,
        modelName: 'company',
        tableName: 'company',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = company;
