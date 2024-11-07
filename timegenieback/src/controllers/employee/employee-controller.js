const employeeService = require('../../services/employee-service');
const constants = require("../../constants/roles")

const createEmployee = async (req, res, next) => {
    try {
        const user = req.user
        const employee = req.body;
        const response = await employeeService.createEmployee(user, employee);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getEmployee = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await employeeService.getEmployee(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const updateEmployee = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const response = await employeeService.updateEmployee(user, request);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const deleteEmployee = async (req, res, next) => {
    try {
        const user = req.user;
        const employee = req.query;
        const response = await employeeService.deleteEmployee(user, employee);

        return res.status(200).json(response);
    } catch (error) {
        return next(error);
    }
}

const getAllEmployeesFromCompany = async (req, res, next) => {
    try {
        const user = req.user;
        let company_name = user.company;
        if (user.roles.includes(constants.SUPERADMIN) || user.roles.includes(constants.ADMIN)) {
            company_name = req.query.name;
        }
        const response = await employeeService.getAllEmployees(company_name);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getManagerEmployees = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await employeeService.getManagerEmployees(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error at getManagerEmployees: ', error);
        return next(error);
    }
}

const getLatestEmployee = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await employeeService.getLatestEmployee(user);
        return res.status(200).json(response);

    } catch (error) {
        console.log('Error at getLatestClockIn: ', error);
        return next(error)
    }
}

module.exports = {
    createEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployeesFromCompany,
    getManagerEmployees,
    getLatestEmployee,
}
