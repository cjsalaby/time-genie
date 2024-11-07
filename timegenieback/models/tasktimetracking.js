'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskTimeTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskTimeTracking.init({
tracking_id: DataTypes.INTEGER,
    employee_id: DataTypes.UUID,
    task_id: DataTypes.INTEGER,
    time_spent:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskTimeTracking',
  });
  return TaskTimeTracking;
};