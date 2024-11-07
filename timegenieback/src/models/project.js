const {Sequelize, DataTypes, UUIDV4} = require('sequelize');
const sequelize = require('../db/db');
const projectStatuses = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'ON HOLD'];
const projectHealths = ['On Track', 'At Risk', 'Off Track'];
const projectPhases = ['Plan & Prepare', 'Build & Manage', 'Close & Sustain', 'Completed'];
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const Status = sequelize.define('ProjectStatus', {
    name: DataTypes.ENUM(projectStatuses)
});

const Health = sequelize.define('ProjectHealth', {
    name: DataTypes.ENUM(projectHealths)
});

const Phase = sequelize.define('ProjectPhase', {
    name: DataTypes.ENUM(projectPhases)
});

const Project = sequelize.define('project', {
        project_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255)
        },
        start_date: {
            type: DataTypes.DATEONLY,
            defaultValue: Sequelize.literal('current_date'),
            allowNull: false
        },
        estimated_end_date: {
            type: DataTypes.DATEONLY
        },
        actual_end_date: {
            type: DataTypes.DATEONLY
        },
        status: {
            type: Status,
            defaultValue: 'ACTIVE'
        },
        health: {
            type: Health,
            defaultValue: 'On Track'
        },
        phase: {
            type: Phase,
            defaultValue: 'Plan & Prepare'
        },
        assigned_employees: {
            type: DataTypes.ARRAY(DataTypes.UUID)
        },
        company_name: {
            type: DataTypes.STRING(255),
            references: {
                model: 'company',
                key: 'company_name'
            }
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
        modelName: 'project',
        tableName: 'project',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

module.exports = {
    projectStatuses,
    projectHealths,
    projectPhases,
    Project
};