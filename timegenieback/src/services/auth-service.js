const {getEmployee} = require('../db/repository/employee-repository');
const {getCompany} = require('../db/repository/company-repository');
const {getAdmin} = require('../db/repository/administrator-repository');
const {hashPassword, verifyPassword} = require('../utils/bcryptUtils');
const {generateToken} = require('../utils/jwtUtils');
const {badRequestError, notFoundError} = require("../utils/errors-helper");

const login = async (credentials) => {
    const {username, company_name, password} = credentials;

    const admin = await getAdmin(username);
    if (admin ) {
        const token = generateToken({
            username: username,
            roles: [admin.administrator_type],
            emp_id: admin.admin_id
        })
        return {
            success: true,
            message: `Welcome back ${admin.administrator_type}: ${admin.first_name}`,
            roles: [admin.administrator_type],
            token: token,
        }
    }

    const employee = await getEmployee(username, company_name);
    const company = await getCompany(company_name);

    if (!company) {
        notFoundError('Company does not exist.');
    }

    if (!employee || !await verifyPassword(password, employee.password)) {
        badRequestError('Incorrect username or password.');
    }

    const emp_id = employee.emp_id;
    const token = generateToken({
        username: username,
        company: company_name,
        roles: employee.roles,
        emp_id: emp_id
    });

    return {
        success: true,
        roles: employee.roles,
        message: `Welcome back ${employee.first_name}`,
        token: token,
    }
}

const updatePassword = async (user, credentials) => {
    const {password, new_password} = credentials;

    const employee = await getEmployee(user.username, user.company);

    if (!employee || !await verifyPassword(password, employee.password)) {
        badRequestError('Incorrect username or password.');
    }

    const hashedPassword = await hashPassword(new_password);

    employee.set({
        password: hashedPassword,
    })

    await employee.save();

    return {
        success: true,
        message: 'Employee password updated.',
    }
}

module.exports = {
    login,
    updatePassword,
}
