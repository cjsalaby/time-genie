const {DataTypes} = require('sequelize');
const sequelize = require('../db/db');
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const TimeChangeRequest = sequelize.define('timeChangeRequest', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        emp_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            references: {
                model: 'employee',
                key: 'emp_id'
            }
        },
        description: {
            type: DataTypes.STRING
        },
        timesheet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'timesheet',
                key: 'timesheet_id'
            }
        },
        is_approved: {
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
        modelName: 'timechangerequest',
        tableName: 'timechangerequest',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    TimeChangeRequest
};
