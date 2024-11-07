const {Employee} = require('../../models/employee');
const {Sequelize} = require("sequelize");

const createEmployee = async (employeeData) => {

    const employee = new Employee(employeeData);
    return await employee.save();

}

const getEmployee = async (username, company) => {
    return await Employee.findOne({
        where: {
            username: username,
            company_name: company,
        }
    });
}

const getEmployeeByIdAndCompany = async (id, company) => {
    return await Employee.findOne({
        where: {
            emp_id: id,
            company_name: company
        }
    });
}

const getEmployeesFromIds = async(ids) => {
    return await Employee.findAll({
        where:{
            emp_id: ids
        }
    })
}

const getEmpById = async (emp_id) => {

    return await Employee.findOne({
        where: {
            emp_id: emp_id
        }
    });

}

const updateEmployee = async (employee, updateData) => {
    if (updateData.email) {
        employee.set({
            email: updateData.email,
        })
    }
    if (updateData.roles) {
        employee.set({
            roles: updateData.roles,
        })
    }
    if (updateData.employment_type) {
        employee.set({
            employment_type: updateData.employment_type,
        })
    }
    if (updateData.max_breaks) {
        employee.set({
            max_breaks: updateData.max_breaks,
        });
    }

    if (updateData.break_duration) {
        employee.set({
            break_duration: updateData.break_duration,
        });
    }
    return employee.save();
}

const deleteEmployee = async (username, company) => {
    return await Employee.destroy({
        where: {
            username: username,
            company_name: company,
        }
    });
}

const getAllEmployees = async (company) => {
    return await Employee.findAll({
        where: {
            company_name: company,
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
}

const getManager = async (username, company) => {
    return await Employee.findOne({
        where: {
            username: username,
            company_name: company,
            roles: {
                [Sequelize.Op.contains]: Sequelize.literal("ARRAY['MANAGER'::emp_role]")
            }
        }
    });
}

const getManagerEmployees = async (id) => {
    return await Employee.findAll({
        where: {
            manager_id: id,
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
}

module.exports = {
    createEmployee,
    getEmployee,
    getEmployeeByIdAndCompany,
    getEmployeesFromIds,
    updateEmployee,
    deleteEmployee,
    getAllEmployees,
    getManager,
    getManagerEmployees,
    getEmpById
}

