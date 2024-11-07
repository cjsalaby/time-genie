'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectTimeTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectTimeTracking.init({
    tracking_id: DataTypes.INTEGER,
    employee_id: DataTypes.UUID,
    project_id: DataTypes.INTEGER,
    total_time_spent: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectTimeTracking',
  });
  return ProjectTimeTracking;
};