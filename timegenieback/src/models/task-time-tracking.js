const { DataTypes} = require('sequelize');
const sequelize = require('../db/db');
const TaskTimeTracking = sequelize.define('tasktimetracking', {
        tracking_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_id: {
            type: DataTypes.UUIDV4,
            references: {
                model: 'employee',
                key: 'emp_id'
            }
        },
        task_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'task',
                key: 'task_id',
            }
        },
        project_time_tracking_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'projecttimetracking',
                key: 'tracking_id'
            }
        },
        time_spent: {
            type: DataTypes.INTEGER,
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
        },
        deleted_at: {
            type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        paranoid: true,
        modelName: 'tasktimetracking',
        tableName: 'tasktimetracking',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    TaskTimeTracking
};
