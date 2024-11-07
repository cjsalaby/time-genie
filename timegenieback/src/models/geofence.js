const { DataTypes, Sequelize} = require('sequelize');
const sequelize = require('../db/db');

const Geofence = sequelize.define('geofence', {
    geofence_id: {
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
    geolocation: {
        type: Sequelize.literal('POINT'),
        allowNull: false,
    },
    radius: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        modelName: 'geofence',
        tableName: 'geofence',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = {
    Geofence,
}

