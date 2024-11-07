'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employee.init({
    emp_id: DataTypes.UUID,
    manager_id: DataTypes.UUID,
    company_name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roles: DataTypes.STRING,
    employment_type: DataTypes.STRING,
    max_breaks: DataTypes.INT,
    breaks_remaining: DataTypes.INT,
    break_duration: DataTypes.INT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    timezone: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'employees',
  });
  return employee;
};
