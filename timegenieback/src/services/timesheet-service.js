const timesheetRepo = require('../db/repository/timesheet-repository');
const employeeRepo = require('../db/repository/employee-repository');
const companyRepo = require('../db/repository/company-repository');
const {notFoundError, badRequestError} = require("../utils/errors-helper");
const {isValid, parseDate, sevenDayHourTotal, thirtyDayHourTotal, convertDateToTimezone} = require("../utils/date-fns-helper");
const {sendEmailAlertWithHTML} = require("../utils/email-alert-helper");

const getTimeSheets = async (user) => {
    const timesheets = await timesheetRepo.getTimeSheets(user.emp_id);
    if (!timesheets) {
        notFoundError('Employee has no timesheet records.');
    }
    await convertTimesheetsToCompanyTimezone(user.company, timesheets);
    return timesheets;
}

const getEmployeeTimeSheets = async (request, user) => {
    const employee = await employeeRepo.getEmployee(request.username, user.company);
    const timesheets = await timesheetRepo.getTimeSheets(employee.emp_id);
    if(!timesheets) {
        notFoundError('Employee has no timesheet records.');
    }
    await convertTimesheetsToCompanyTimezone(user.company, timesheets);
    return timesheets;
}

const convertTimesheetsToCompanyTimezone = async (userCompany, timesheets) => {
    const company = await companyRepo.getCompany(userCompany);
    const timezone = company.dataValues.timezone;
    for (let i = 0; i < timesheets.length; i++) {
        const timesheet = timesheets[i].dataValues;
        timesheet.clock_in_time = convertDateToTimezone(timesheet.clock_in_time, timezone);
        timesheet.clock_out_time = convertDateToTimezone(timesheet.clock_out_time, timezone);
    }
}

const clockIn = async (user, body) => {
    const timesheet = await timesheetRepo.getLatestClockRecord(user.emp_id);
    if (timesheet.clock_in_time && timesheet.clock_out_time === null) {
        badRequestError('This employee is still clocked in');
    }
    const employee = await employeeRepo.getEmpById(user.emp_id);
    const manager = await employeeRepo.getEmpById(employee.manager_id);
    if (!body.is_approved) {
        sendEmailAlertWithHTML(
            manager.email,
            'ALERT: Employee Clocked In Outside Geofence',
            formatEmailText('clocking in', employee),
            formatEmailHTML('clocking in', employee)
        );
    }
    return await timesheetRepo.clockIn(user.emp_id, body.geolocation, body.in_region, body.is_approved);
}

const clockOut = async (user, body) => {
    const timesheet = await timesheetRepo.getLatestClockRecord(user.emp_id);
    if (!timesheet) {
        notFoundError('Could not find latest clock in record.');
    }
    if (timesheet.clock_in_time && timesheet.clock_out_time) {
        badRequestError('This employee has already clocked out');
    }

    const employee = await employeeRepo.getEmpById(user.emp_id);
    try {
        const manager = await employeeRepo.getEmpById(employee.manager_id);
        if (!body.is_approved) {
            sendEmailAlertWithHTML(
                manager.email,
                'ALERT: Employee Clocked Out Outside Geofence',
                formatEmailText('clocking out', employee),
                formatEmailHTML('clocking in', employee)
            );
        }
    } catch (e) {
        // Error indicates that employee clocking out has no manager
    }

    return await timesheetRepo.clockOut(timesheet, body.geolocation, body.in_region);
}

const formatEmailText = (event, employee) => {
    return (`You are receiving this email because the system flagged an employee ${event} outside the geofence
            \n
            Employee Details:\n
            \t${employee.first_name} ${employee.last_name}\n
            \t${employee.username}\n
            \t${employee.email}\n`);
}

const formatEmailHTML = (event, employee) => {
    return (`<p>You are receiving this email because the system flagged an employee ${event} outside the geofence<br><br>
            Employee Details:<br>
            &nbsp;&nbsp;${employee.first_name} ${employee.last_name}<br>
            &nbsp;&nbsp;${employee.username}<br>
            &nbsp;&nbsp;${employee.email}<br>
            </p>`);
}

const getLatestClockRecord = async (user) => {
    const latest = await timesheetRepo.getLatestClockRecord(user.emp_id);
    if (!latest) {
        notFoundError('Clock data not found');
    }
    return latest;
}

const getTotalHours = async (user) => {
    const timesheets = await timesheetRepo.getTimeSheets(user.emp_id);
    if (!timesheets) {
        notFoundError('Timesheet data not found.');
    }

    const sevenDayTotal = sevenDayHourTotal(timesheets);
    const thirtyDayTotal = thirtyDayHourTotal(timesheets);

    return {
        totalHoursSeven: sevenDayTotal,
        totalHoursThirty: thirtyDayTotal,
    }
}

//TODO: we need to switch from querying usernames to using emp_ids
const editTimesheet = async (user, request) => {
    const {username, timesheet_id, clock_in, clock_out, is_approved} = request;

    const employee = await employeeRepo.getEmployee(username, user.company);
    if(!employee) {
        badRequestError('Employee with this username does not exist.')
    }
    const timesheet = await timesheetRepo.getTimesheetByID(timesheet_id);
    if(!timesheet) {
        badRequestError('Timesheet with this ID does not exist');
    }
    if(employee.emp_id !== timesheet.emp_id) {
        badRequestError('This timesheet does not belong to this employee.')
    }
    if(clock_in) {
        if(!isValid(parseDate(clock_in))) {
            badRequestError('Incorrect date and time format for clock in.');
        }
    }
    if(clock_out) {
        if(!isValid(parseDate(clock_out))) {
            badRequestError('Incorrect date and time format for clock out.');
        }
    }
    if(is_approved) {
        if(typeof is_approved !== 'boolean') {
            badRequestError('Timesheet approval configuration is required');
        }
    }

    const editData = {
        clock_in,
        clock_out,
        is_approved,
    }
    return await timesheetRepo.editTimesheet(timesheet, editData);
}

module.exports = {
    getTimeSheets,
    clockIn,
    clockOut,
    getLatestClockRecord,
    getTotalHours,
    editTimesheet,
    getEmployeeTimeSheets,
    convertTimesheetsToCompanyTimezone
}
