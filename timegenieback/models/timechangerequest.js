'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timechangerequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  timechangerequest.init({
    id: DataTypes.INT,
    emp_id: DataTypes.uuid,
    timesheet_id: DataTypes.INT,
    description: DataTypes.STRING,
    is_approved: DataTypes.Boolean
  }, {
    sequelize,
    modelName: 'timechangerequest',
  });
  return timechangerequest;
};
