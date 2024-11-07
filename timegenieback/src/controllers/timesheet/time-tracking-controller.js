const trackTimeService = require('../../services/track-time-service')

const startTime = async(req, res, next) => {
    try {
        const empId = req.user.emp_id;
        const taskId = req.body.task_id;
        const response = await trackTimeService.startTime(empId, taskId);

        return res.status(201).json(response);
    } catch(error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const stopTime = async(req, res, next) => {
    try {
        const empId = req.user.emp_id;
        const taskId = req.body.task_id;
        const response = await trackTimeService.stopTime(empId, taskId);

        return res.status(201).json(response);
    } catch(error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getTotalProjectTime = async(req, res, next) => {
    try {
        const employeeId = req.user.emp_id;
        const project_id = req.query.project_id;
        const response = await trackTimeService.getTotalProjectTime(employeeId, project_id);

        return res.status(200).json(response);
    } catch(error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getTotalTaskTime = async (req, res, next) => {
    try {
        const employeeId = req.user.emp_id;
        const task_id = req.query.task_id;
        const company = req.user.company;
        const response = await trackTimeService.getTotalTaskTime(employeeId, task_id, company);
        return res.status(200).json(response);
    } catch(error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getProjectTimeTrackingEvents = async (req, res, next) => {
    try {
        const employeeId = req.user.emp_id;
        const projectId = req.query.project_id;
        const response = await trackTimeService.getProjectTimeTrackingEvents(employeeId, projectId);

        return res.status(200).json(response);
    } catch(error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getTaskTimeTrackingEvents = async (req, res, next) => {
    try {
        const employeeId = req.user.emp_id;
        const username = req.user.username;

        const task_id = req.query.task_id;
        const response = await trackTimeService.getTaskTimeTrackingEvents(employeeId, task_id, username);

        return res.status(200).json(response);
    } catch(error) {
        console.log('Error: ', error);
        return next(error);
    }
}

module.exports = {
    startTime,
    stopTime,
    getTotalProjectTime,
    getTotalTaskTime,
    getProjectTimeTrackingEvents,
    getTaskTimeTrackingEvents
}