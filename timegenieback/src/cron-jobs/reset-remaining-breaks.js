const employeeService = require("../services/employee-service");
const breakService = require("../services/break-service");

const resetRemainingBreaks = async (company_name) => {
    const employees = await employeeService.getAllEmployees(company_name);
    for (let i = 0; i < employees.length; i++) {
        await breakService.editBreaksRemaining(employees[i].emp_id, employees[i].max_breaks);
    }
}

module.exports = {
    resetRemainingBreaks
}
