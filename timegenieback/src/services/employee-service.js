const employeeRepo = require('../db/repository/employee-repository');
const companyRepo = require('../db/repository/company-repository');
const {badRequestError, notFoundError} = require("../utils/errors-helper");
const {hashPassword} = require("../utils/bcryptUtils");
const {getLatestClockRecord} = require("../db/repository/timesheet-repository");

const createEmployee = async (user, employee) => {
    const manager = await employeeRepo.getManager(user.username, user.company);
    const {first_name, last_name, username, email, password, roles, employment_type} = employee;

    if (await employeeRepo.getEmployee(username, user.company)) {
        badRequestError('Employee already exists.');
    }
    const company_name = user.company;
    const manager_id = manager.emp_id;
    const hashedPassword = await hashPassword(password);

    const employeeData = {
        company_name,
        manager_id,
        first_name,
        last_name,
        username,
        email,
        password: hashedPassword,
        roles,
        employment_type,
    };

    return await employeeRepo.createEmployee(employeeData);
}

const getEmployee = async (user) => {
    const employee = await employeeRepo.getEmployee(user.username, user.company);

    if (!employee) {
        notFoundError('Employee with that username does not exist.');
    }
    employee.break_duration = employee.break_duration / 60;

    return employee;
}

const updateEmployee = async (user, request) => {
    const {username, email, roles, employment_type, max_breaks, break_duration} = request;

    const employee = await employeeRepo.getEmployee(username, user.company);

    if (!employee) {
        notFoundError('Employee with that username does not exist.');
    }


    const updateData = {
        email,
        roles,
        employment_type,
        max_breaks,
        break_duration
    }

    // Break duration gets sent as minutes in request but is in seconds within database
    if (updateData.break_duration) {
        updateData.break_duration = break_duration * 60
    }
    return await employeeRepo.updateEmployee(employee, updateData);
}

const deleteEmployee = async (user, employee) => {
    const {username, company_name} = employee;

    const emp = await employeeRepo.getEmployee(username, company_name);
    if (!emp) {
        notFoundError('Employee with that username does not exist.');
    }

    return await employeeRepo.deleteEmployee(username, company_name);
}

const getAllEmployees = async (company_name) => {
    const company = await companyRepo.getCompany(company_name);
    if (!company) {
        notFoundError('Company does not exist.');
    }
    const employees = await employeeRepo.getAllEmployees(company_name);
    for (let i = 0; i < employees.length; i++) {
        employees[i].break_duration = employees[i].break_duration / 60;
    }
    return employees;
}

const getManagerEmployees = async (user) => {
    const manager = await employeeRepo.getManager(user.username, user.company);
    const employees = await employeeRepo.getManagerEmployees(manager.emp_id);
    for (let i = 0; i < employees.length; i++) {
        employees[i].break_duration = employees[i].break_duration / 60;
    }
    return [manager, ...employees];
}

const getLatestEmployee = async (user) => {
    const manager = await employeeRepo.getManager(user.username, user.company);
    const emp_list = await employeeRepo.getManagerEmployees(manager.emp_id);

    let latestTime = null;
    let latestEmployee = null;

    for (let i = 0; i < emp_list.length; i++) {
        const employee = emp_list[i];
        const latestClockRecord = await getLatestClockRecord(employee.emp_id);

        if (latestClockRecord && (!latestTime || latestClockRecord.clock_in_time > latestTime)) {
            latestTime = latestClockRecord.clock_in_time;
            latestEmployee = employee;
        }
    }

    return {
        "employee": latestEmployee.first_name + " " + latestEmployee.last_name,
        "clock_in": latestTime,
    };

}


module.exports = {
    createEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployees,
    getManagerEmployees,
    getLatestEmployee,
}
