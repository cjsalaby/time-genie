//primary body from Alvin project tracking file changed to specfics
const { DataTypes} = require('sequelize');
const sequelize = require('../db/db');
const BreakTimeTrackings = sequelize.define('breaks', {
    break_id: {
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
    start_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    scheduled_stop_time: {
        type: DataTypes.DATE
    },
    stop_time: {
        type: DataTypes.DATE
    },
    total_time_spent: {
        type: DataTypes.INTEGER,
    },
    is_flagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
        modelName: 'breaks',
        tableName: 'breaks',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    BreakTimeTracking: BreakTimeTrackings
};
