const {ProjectTimeTracking} = require('../../models/project-time-tracking');

const getProjectTimeTracking = async (employee_id, project_id) => {
    return await ProjectTimeTracking.findOne({
        where: {
            employee_id: employee_id,
            project_id: project_id
        }
    });
}

const createProjectTimeTracking = async(employee_id, project_id) => {
    return await ProjectTimeTracking.create({
        employee_id: employee_id,
        project_id: project_id
    });
}

module.exports = {
    getProjectTimeTracking,
    createProjectTimeTracking
}
