const timeChangeRequestRepo = require('../db/repository/timechange-request-repository');
const timesheetRepo = require('../db/repository/timesheet-repository');
const employeeRepo = require('../db/repository/employee-repository');
const {notFoundError, badRequestError, unauthorizedError} = require("../utils/errors-helper");

const getEmployeeTimeChangeRequests = async (user) => {
    const timeChangeRequests = await timeChangeRequestRepo.getAllTimeChangeRequestFromEmpId(user.emp_id);
    if (!timeChangeRequests) {
        notFoundError('Employee has no time change requests.');
    }
    return timeChangeRequests;
}

const getAllManagerEmployeeTimeChangeRequests = async (user) => {
    const employeeIds = await getEmployeeIds(user.emp_id);
    const timeChangeRequests = await timeChangeRequestRepo.getAllEmployeeTimeChangeRequests(employeeIds);
    if (!timeChangeRequests) {
        notFoundError('No employees with time change requests.')
    }
    for (let i = 0; i < timeChangeRequests.length; i++) {
        const timeChangeRequest = timeChangeRequests[i];
        const employee = await employeeRepo.getEmpById(timeChangeRequest.dataValues.emp_id);
        timeChangeRequest.dataValues.username = employee.username;
    }
    return timeChangeRequests;
}

const addTimeChangeRequest = async (user, timesheet_id, description) => {
    const timesheet = await timesheetRepo.getTimesheetByID(timesheet_id);
    if (!timesheet) {
        notFoundError('Unable to find timesheet');
    }
    const timeChangeRequest = await timeChangeRequestRepo.addTimeChangeRequest(user.emp_id, timesheet_id, description);
    if (!timeChangeRequest) {
        badRequestError('Unable to create time change request');
    }
    return timeChangeRequest;
}

const setApproval = async (user, id, approval) => {
    const timeChangeRequest = await timeChangeRequestRepo.getTimeChangeRequest(id);
    if (!timeChangeRequest) {
        notFoundError('Unable to find time change request');
    }
    const validation = await validateManagerAccess(user.emp_id, timeChangeRequest);
    if (!validation) {
        unauthorizedError('Unable to access time change request');
    }

    const editedRequest = await timeChangeRequestRepo.setApproval(timeChangeRequest, approval);
    if (!editedRequest) {
        badRequestError('Unable to set approval for time change request');
    }

    return editedRequest;
}

const getEmployeeIds = async (managerId) => {
    const employees = await employeeRepo.getManagerEmployees(managerId);
    const employeeIds = [];

    for (let i = 0; i < employees.length; i++) {
        employeeIds.push(employees[i].dataValues.emp_id);
    }
    return employeeIds;
}

const validateManagerAccess = async (managerId, timeChangeRequest) => {
    const employeeIds = await getEmployeeIds(managerId);
    for (let i = 0; i < employeeIds.length; i++) {
        if (timeChangeRequest.dataValues.emp_id === employeeIds[i]) {
            return true;
        }
    }
    return false;
}

module.exports = {
    getEmployeeTimeChangeRequests,
    getAllManagerEmployeeTimeChangeRequests,
    addTimeChangeRequest,
    setApproval
}
