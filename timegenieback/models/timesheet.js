'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timesheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  timesheet.init({
    timesheet_id: DataTypes.INTEGER,
    emp_id: DataTypes.UUID,
    clock_in_time: DataTypes.DATE,
    clock_out_time: DataTypes.DATE,
    clock_in_location: DataTypes.STRING,
    clock_out_location: DataTypes.STRING,
    clock_in_region: DataTypes.BOOLEAN,
    clock_out_region: DataTypes.BOOLEAN,
    project_id: DataTypes.INTEGER,
    clock_in_is_approved: DataTypes.BOOLEAN,
    clock_out_is_approved: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'timesheet',
  });
  return timesheet;
};
