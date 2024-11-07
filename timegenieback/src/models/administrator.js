const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db/db');
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const adminType = sequelize.define('admin_type', {
    name: DataTypes.ENUM('ADMIN', 'SUPERADMIN'),
});

const administrator = sequelize.define('administrator', {
        admin_id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        administrator_type: {
            type: adminType,
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
        }
    },
    {
        sequelize,
        paranoid: true,
        modelName: 'administrator',
        tableName: 'administrator',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

module.exports = administrator;