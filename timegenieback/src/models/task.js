const {Sequelize, DataTypes, UUIDV4} = require('sequelize');
const sequelize = require('../db/db');
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const taskStatuses = ['NEW', 'IN-PROGRESS', 'TESTING', 'COMPLETED'];

const Task = sequelize.define('task', {
        task_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        project_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'project',
                key: 'project_id',
            }
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            defaultValue: Sequelize.literal('current_date'),
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
        },
        status: {
            type: DataTypes.ENUM(taskStatuses),
            defaultValue: 'NEW',
        },
        assigned_employee: {
            type: DataTypes.UUIDV4,
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
        modelName: 'task',
        tableName: 'task',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

module.exports = {
    taskStatuses,
    Task
};