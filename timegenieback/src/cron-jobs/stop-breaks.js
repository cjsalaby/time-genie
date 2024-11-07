const employeeService = require("../services/employee-service");
const breakService = require("../services/break-service");
const { isAfter } = require('date-fns');

/**
 * This cronJob runs every at every minute * * * * *
 * Iterates through each company getting each employees' latest break data
 * If break is in progress and break has exceeded scheduled stop time
 * Then the break will automatically stop
 * @param company_name
 * @returns {Promise<void>}
 */
const stopBreaks = async (company_name) => {
    const employees = await employeeService.getAllEmployees(company_name);
    for (let i = 0; i < employees.length; i++) {

        const breakData = await breakService.getLatestBreak(employees[i].emp_id);
        const now = new Date();

        if(breakData.in_progress) {
            if(isAfter(now, breakData.scheduled_stop_time)) {
                console.log(`Stopping break for ${employees[i].emp_id}`)
                await breakService.stopBreakTime(employees[i].emp_id);
            }
        }
    }
}

module.exports = {
    stopBreaks,
}

