const employeeService = require("../services/employee-service");
const timesheetService = require("../services/timesheet-service");

const checkClockInBoundaries = async (company_name) => {
    const employees = await employeeService.getAllEmployees(company_name);
    for (let i = 0; i < employees.length; i++) {
        const user = {
            emp_id: employees[i].dataValues.emp_id
        }
        let latestClockRecord
        try {
             latestClockRecord = await timesheetService.getLatestClockRecord(user);
        } catch (e) {
            continue;
        }
        const body = {
            geolocation: null,
            in_region: null,
            is_approved: null
        }
        if (latestClockRecord.dataValues.clock_out_time === null) {
            await timesheetService.clockOut(user, body);
        }
    }
}

module.exports = {
    checkClockInBoundaries
}
