'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskTimeEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskTimeEvent.init({
    event_id: DataTypes.INTEGER,
    employee_id: DataTypes.UUID,
    task_id: DataTypes.INTEGER,
    tracking_id: DataTypes.INTEGER,
    start_time: DataTypes.DATE,
    stop_time: DataTypes.DATE,
    in_progress: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TaskTimeEvent',
  });
  return TaskTimeEvent;
};