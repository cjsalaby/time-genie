const Joi = require('joi');

const {employeeRoles, employeeTypes} = require('../../../models/employee');

const updateEmployeeValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Please include employee username'
    }),
    email: Joi.string().pattern(new RegExp('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')).max(255),
    roles: Joi.array().items(Joi.string().valid(...employeeRoles)),
    employment_type: Joi.string().valid(...employeeTypes),
    max_breaks: Joi.number().max(10),
    break_duration: Joi.number().max(60),
});

module.exports = {
    updateEmployeeValidationSchema
}
