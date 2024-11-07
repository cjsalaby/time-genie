const {TaskTimeTracking} = require('../../models/task-time-tracking');

const getTaskTimeTracking = async (employee_id, task_id) => {
    return await TaskTimeTracking.findOne({
        where: {
            employee_id: employee_id,
            task_id: task_id
        }
    });
}

const createTaskTimeTracking = async(employee_id, task_id, project_time_tracking_id) => {
    return await TaskTimeTracking.create({
        employee_id: employee_id,
        task_id: task_id,
        project_time_tracking_id: project_time_tracking_id
    });
}

module.exports = {
    getTaskTimeTracking,
    createTaskTimeTracking
}
