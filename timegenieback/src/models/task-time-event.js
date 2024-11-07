const { DataTypes, Sequelize} = require('sequelize');
const sequelize = require('../db/db');
const TaskTimeEvent = sequelize.define('tasktimeevent', {
        event_id: {
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
        tracking_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tasktimetracking',
                key: 'task_id',
            }
        },
        start_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('now'),
            allowNull: false
        },
        stop_time: {
            type: DataTypes.DATE,
        },
        in_progress: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        modelName: 'tasktimeevent',
        tableName: 'tasktimeevent',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    TaskTimeEvent
};
