const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db/db');
/* eslint no-unused-vars: "off" -- datatypes wont be used even thought it is. */
const employeeRoles = ['OFFICE', 'REMOTE', 'FIELD', 'REPAIR', 'MANAGER'];
const employeeTypes = ['FULLTIME', 'PARTTIME']

const EmpRole = sequelize.define('EmpRole', {
    name: DataTypes.ENUM(employeeRoles),
});

const EmployType = sequelize.define('EmployType', {
    name: DataTypes.ENUM(employeeTypes),
});

// Define the Employee model
const Employee = sequelize.define('employee', {
        emp_id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            primaryKey: true,
        },
        manager_id: {
            type: DataTypes.UUID,
            references: {
                model: 'employee',
                key: 'emp_id',
            },
        },
        company_name: {
            type: DataTypes.STRING(255),
            references: {
                model: 'company',
                key: 'company_name',
            },
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
        },
        email: {
            type: DataTypes.STRING(255)
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        roles: {
            type: DataTypes.ARRAY(EmpRole),
            allowNull: false,
        },
        employment_type: {
            type: EmployType,
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
        max_breaks: {
            type: DataTypes.INTEGER,
        },
        breaks_remaining: {
            type: DataTypes.INTEGER,
        },
        break_duration: {
            type: DataTypes.INTEGER,
        }
    },
    {
        sequelize,
        paranoid: true,
        modelName: 'employee',
        tableName: 'employee',
        timeStamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

// Define foreign key constraints
Employee.belongsTo(Employee, {as: 'Manager', foreignKey: 'manager_id'});

module.exports = {
    employeeRoles,
    employeeTypes,
    Employee
};

