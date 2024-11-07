const { DataTypes} = require('sequelize');
const sequelize = require('../db/db');
const ProjectTimeTracking = sequelize.define('projecttimetracking', {
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
        project_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'project',
                key: 'project_id',
            }
        },
        total_time_spent: {
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
        modelName: 'projecttimetracking',
        tableName: 'projecttimetracking',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    ProjectTimeTracking
};
