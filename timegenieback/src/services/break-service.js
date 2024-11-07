/**
 * This file handles business logic for functionality relating to breaks.
 *
 * Author(s): Trevor Thompson, Alvin Tran, Coleman Salaby
 * Date: 04/18/2024
 *
*/

const breakRepository = require('../db/repository/break-repository');
const employeeRepository = require('../db/repository/employee-repository');
const { notFoundError, badRequestError} = require("../utils/errors-helper");
const employeeRepo = require("../db/repository/employee-repository");
const {sendEmailAlertWithHTML} = require("../utils/email-alert-helper");
const companyRepo = require("../db/repository/company-repository");
const {convertDateToTimezone} = require("../utils/date-fns-helper");

/**
 * Handles business logic to start a break for a specific employee.
 *
 * @param employeeId
 * @returns {Promise<*>}
 */
const startBreakTime = async (employeeId) => {
    const breakCheck = await breakRepository.getLatestBreak(employeeId);
    if (breakCheck) {
        if (breakCheck.start_time && breakCheck.stop_time === null) {
            badRequestError('Break is already started');
        }
    }
    const employee = await employeeRepository.getEmpById(employeeId);
    const remainingBreaks = employee.dataValues.breaks_remaining;
    if (remainingBreaks <= 0) {
        badRequestError('No more breaks remaining');
    }
    const startBreak = await breakRepository.startBreakTime(employeeId);
    await breakRepository.setRemainingBreaks(employee, remainingBreaks - 1)
    return startBreak;
}

/**
 * Handles business logic for stopping a break for a specific employee.
 *
 * @param employeeId
 * @returns {Promise<*>}
 */
const stopBreakTime = async (employeeId) => {
    const breakCheck = await breakRepository.getLatestBreak(employeeId);
    if (!breakCheck) {
        notFoundError('Could not find latest break record.');
    }
    if (breakCheck.start_time && breakCheck.stop_time) {
        badRequestError('This employee has already stopped break');
    }

    return await breakRepository.stopBreakTime(breakCheck);
}

/**
 * Business logic for getting the latest break record for a specific employee.
 *
 * @param employeeId
 * @returns {Promise<Model|null>}
 */
const getLatestBreak = async (employeeId) => {
    const latest = await breakRepository.getLatestBreak(employeeId);
    if (!latest) {
        notFoundError('Break data not found');
    }
    return latest;
}

/**
 * Business logic for getting all the break records for a specific employee.
 *
 * @param employeeId
 * @returns {Promise<Model[]>}
 */
const getBreaks = async (employeeId) => {
    const latest = await breakRepository.getBreaks(employeeId);
    if (!latest) {
        notFoundError('Break data not found');
    }
    return latest;
}

/**
 * Business logic for setting max allotted breaks and max break duration
 * for a specific employee.
 *
 * @param employeeId
 * @param maxBreaks
 * @param duration
 * @returns {Promise<Model|null>}
 */
const setBreaksInfo = async (employeeId, maxBreaks, duration) => {
    const employeeCheck = await employeeRepository.getEmpById(employeeId);
    if (!employeeCheck) {
        notFoundError('Could not find employee.');
    }
    const durationSeconds = duration * 60;
    return await breakRepository.setBreaks(employeeCheck, maxBreaks, durationSeconds);
}

/**
 * Gets the info pertaining to breaks for a specific employee.
 *
 * @param user
 * @returns {Promise<{breaks_remaining: *, break_duration: *, max_breaks: *}>}
 */
const getBreakInfo = async (user) => {
    const employeeExists = await employeeRepository.getEmployeeByIdAndCompany(user.emp_id, user.company);
    if(!employeeExists) {
        notFoundError(`Employee with id: ${user.emp_id} does not exist.`);
    }

    return {
        max_breaks: employeeExists.max_breaks,
        breaks_remaining: employeeExists.breaks_remaining,
        break_duration: (employeeExists.break_duration / 60),
    }
}

/**
 * Gets the info pertaining to is flagged for a specified employee.
 *
 * @param user
 * @returns {Promise<{breaks_remaining: *, break_duration: *, max_breaks: *}>}
 */
const getFlaggedInfo = async (user) => {
    //I believe this is correct but may not be may need to create another method in repo layer
    const latest = await breakRepository.getLatestBreak(user.emp_id);
    if (!latest) {
        notFoundError('Break data not found');
    }
    if (latest.is_flagged) {
        return {
            break_id: latest.break_id,
            employee_id: latest.employee_id,
            is_flagged: latest.is_flagged,
            in_progress: latest.in_progress,
            start_time: latest.start_time,
            stop_time: latest.stop_time,
            scheduled_stop_time: latest.scheduled_stop_time,
        };
    } else {
        return {
            break_id: latest.break_id,
            employee_id: latest.employee_id,
            is_flagged: latest.is_flagged,
            in_progress: latest.in_progress,
            start_time: latest.start_time,
            stop_time: latest.stop_time,
            scheduled_stop_time: latest.scheduled_stop_time,
        };
    }
}

/**
 * sets the info pertaining to is flagged for a specified employee.
 *
 * @param user
 * @returns {Promise<{breaks_remaining: *, break_duration: *, max_breaks: *}>}
 */
const setFlaggedInfo = async (user) => {
    const break_check = await breakRepository.getLatestBreak(user.emp_id);
    if (!break_check) {
        notFoundError('Break data not found');
    }
    if (break_check.is_flagged) {
        badRequestError('Break has already been flagged for exceeding grace period');
    }
    const breakReturn = await breakRepository.setFlaggedInfo(break_check);

    const employee = await employeeRepo.getEmpById(user.emp_id);
    try {
        const manager = await employeeRepo.getEmpById(employee.manager_id);
        sendEmailAlertWithHTML(
            manager.email,
            'ALERT: Employee Exceeded Break Grace Period',
            formatEmailText(employee, breakReturn),
            formatEmailHTML(employee, breakReturn)
        );
    } catch (e) {
        // Error indicates that employee clocking out has no manager
    }
    return breakReturn;
}

const formatEmailText = (employee, breakData) => {
    return (`You are receiving this email because the system flagged an employee exceeding the grace period for their break!
            \n
            Break Start Time: ${breakData.start_time}
            Expected Stop Time: ${breakData.scheduled_stop_time}
            \n
            Employee Details:\n
            \t${employee.first_name} ${employee.last_name}\n
            \t${employee.username}\n
            \t${employee.email}\n`);
}

const formatEmailHTML = (employee, breakData) => {
    return (`<p>You are receiving this email because the system flagged an employee exceeding the grace period for their break!<br><br>
            <br><br>
            Break Start Time: ${breakData.start_time}<br>
            Expected Stop Time: ${breakData.scheduled_stop_time}
            <br><br>
            Employee Details:<br>
            &nbsp;&nbsp;${employee.first_name} ${employee.last_name}<br>
            &nbsp;&nbsp;${employee.username}<br>
            &nbsp;&nbsp;${employee.email}<br>
            </p>`);
}

/**
 * Business logic for setting the breaks remaining manually for a specific employee.
 *
 * @param user
 * @param empId
 * @param newRemaining
 * @returns {Promise<Model|null>}
 */
const editBreaksRemaining = async (empId, newRemaining) => {
    const employeeCheck = await employeeRepository.getEmpById(empId);
    if (!employeeCheck) {
        notFoundError('Could not find employee.');
    }
    const maxBreaks = employeeCheck.max_breaks;
    if (newRemaining > maxBreaks) {
        badRequestError(`${employeeCheck.username} can only have up to ${maxBreaks} breaks`);
    }
    return await breakRepository.setRemainingBreaks(employeeCheck, newRemaining);
}

/**
 * Convert the time data for a break record to the current timezone of the company
 *
 * @param userCompany
 * @param breakRecord
 * @returns {Promise<void>}
 */
const convertBreakRecordToCompanyTimezone = async (userCompany, breakRecord) => {
    const company = await companyRepo.getCompany(userCompany);
    const timezone = company.dataValues.timezone;
    breakRecord.start_time = convertDateToTimezone(breakRecord.start_time, timezone);
    breakRecord.scheduled_stop_time = convertDateToTimezone(breakRecord.scheduled_stop_time, timezone);
    breakRecord.stop_time = convertDateToTimezone(breakRecord.stop_time, timezone);
}

module.exports = {
    startBreakTime,
    stopBreakTime,
    getLatestBreak,
    getBreaks,
    setBreaksInfo,
    getBreakInfo,
    getFlaggedInfo,
    setFlaggedInfo,
    editBreaksRemaining,
    convertBreakRecordToCompanyTimezone
}

