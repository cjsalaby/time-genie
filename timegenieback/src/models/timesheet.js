const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db/db');
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const Timesheet = sequelize.define('timesheet', {
        timesheet_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        emp_id: {
            type: DataTypes.UUIDV4,
        },
        clock_in_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('now'),
            allowNull: false,
        },
        clock_out_time: {
            type: DataTypes.DATE,
        },
        clock_in_location: {
            type: Sequelize.literal('POINT'),
        },
        clock_out_location: {
            type: Sequelize.literal('POINT'),
        },
        clock_in_region: {
            type: DataTypes.BOOLEAN,
        },
        clock_out_region: {
            type: DataTypes.BOOLEAN,
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
            type: DataTypes.BOOLEAN
        },
        clock_out_is_approved: {
            type: DataTypes.BOOLEAN
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
        modelName: 'timesheet',
        tableName: 'timesheet',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    Timesheet
};
