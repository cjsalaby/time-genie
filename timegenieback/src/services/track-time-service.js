const taskTimeEventRepository = require('../db/repository/task-time-event-repository');
const taskTimeTrackingRepository = require('../db/repository/task-time-tracking-repository');
const projectTimeTrackingRepository = require('../db/repository/project-time-tracking-repository');
const taskService = require('./task-service');
const dateHelper = require('../utils/date-fns-helper');
const {badRequestError, notFoundError} = require("../utils/errors-helper");
const {getEmployeeByIdAndCompany} = require("../db/repository/employee-repository");

/**
 * Business logic for creating a time tracking event record.
 *
 * @param employeeId
 * @param taskId
 * @returns {Promise<*>}
 */
const startTime = async (employeeId, taskId) => {
    if (!await assignedToTask(employeeId, taskId)) {
        badRequestError('Employee is not assigned to this task');
    }
    const latestTimeEvent = await taskTimeEventRepository.getLatestTimeEvent(employeeId, taskId);
    const taskTimeTrackRecord = await taskTimeTrackingRepository.getTaskTimeTracking(employeeId, taskId);
    if (latestTimeEvent) {
        badRequestError('Employee has already started tracking time on this task');
    }
    return await taskTimeEventRepository.startTime(employeeId, taskId, taskTimeTrackRecord.tracking_id);
}

/**
 * Business logic for stamping the stop time for a time tracking event record.
 *
 * @param employeeId
 * @param taskId
 * @returns {Promise<*>}
 */
const stopTime = async (employeeId, taskId) => {
    if (!await assignedToTask(employeeId, taskId)) {
        badRequestError('Employee is not assigned to this task');
    }
    const latestTimeEvent = await taskTimeEventRepository.getLatestTimeEvent(employeeId, taskId);
    if (!latestTimeEvent) {
        notFoundError('Unable to find latest time event for this task and employee');
    } else if (latestTimeEvent.in_progress === false) {
        badRequestError('Employee has already stopped tracking time for this task');
    }
    return await taskTimeEventRepository.stopTime(latestTimeEvent);
}


const assignedToTask = async (employeeId, taskId) => {
    const task = await taskService.getTask(taskId);
    const assignedEmployee = task.dataValues.assigned_employee;

    return assignedEmployee === employeeId;
}

/**
 * Retrieves the total time an employee has spent for a project.
 * Essentially an aggregation of time spent on all tasks linked to the requested project.
 *
 * @param employeeId
 * @param projectId
 * @returns {Promise<*>}
 */
const getTotalProjectTime = async (employeeId, projectId) => {
    const projectTimeTracking = await projectTimeTrackingRepository.getProjectTimeTracking(employeeId, projectId);
    if (!projectTimeTracking) {
        notFoundError('Employee is not tracking time for this project');
    }

    return {
        project_id: projectTimeTracking.project_id,
        total_time_spent: dateHelper.convertHours(projectTimeTracking.total_time_spent)
    };
}

/**
 * Retrieves the total time an employee has spent for a specific task.
 *
 * @param employeeId
 * @param task_id
 * @returns {Promise<*>}
 */
const getTotalTaskTime = async (employeeId, task_id, company) => {
    const taskTimeTracking = await taskTimeTrackingRepository.getTaskTimeTracking(employeeId, task_id);
    if (!taskTimeTracking) {
        notFoundError('Employee is not tracking time for this task');
    }
    const latestEvent = await taskTimeEventRepository.getLatestEvent(employeeId, task_id);
    const employee = await getEmployeeByIdAndCompany(employeeId, company)
    return {
        task_id: taskTimeTracking.task_id,
        assigned_employee: employee.username,
        in_progress: latestEvent.in_progress,
        time_spent: dateHelper.convertHours(taskTimeTracking.time_spent)
    };
}

/**
 * Retrieves all the time events related to a specific project.
 *
 * @param employeeId
 * @param projectId
 * @returns {Promise<[]>}
 */
const getProjectTimeTrackingEvents = async (employeeId, projectId) => {
    const projectTasks = await taskService.getProjectTasks(projectId);
    const projectTimeTrackingEvents = [];
    for (const task of projectTasks) {
        projectTimeTrackingEvents.push(await getTaskTimeTrackingEvents(employeeId, task.dataValues.task_id));
    }
    return projectTimeTrackingEvents;
}

/**
 * Retrieves all the time events related to a specific task.
 *
 * @param employeeId
 * @param task_id
 * @returns {Promise<*>}
 */
const getTaskTimeTrackingEvents = async (employeeId, task_id) => {
    return await taskTimeEventRepository.getTimeEvents(employeeId, task_id);
}

module.exports = {
    startTime,
    stopTime,
    getTotalProjectTime,
    getTotalTaskTime,
    getProjectTimeTrackingEvents,
    getTaskTimeTrackingEvents
}
