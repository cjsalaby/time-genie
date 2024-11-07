const Joi = require('joi');
const {employeeRoles, employeeTypes} = require('../../../models/employee');

const createEmployeeValidationSchema = Joi.object({
    first_name: Joi.string().required().messages({
        'any.required': 'Please include employee first name'
    }),
    last_name: Joi.string().required().messages({
        'any.required': 'Please include employee last name'
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Please include employee username'
    }),
    email: Joi.string().pattern(new RegExp('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')).max(255).required().messages({
        'any.required': 'Please include employee email'
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
        'any.required': 'Please include employee password'
    }),
    roles: Joi.array().items(Joi.string().valid(...employeeRoles)).required().messages({
        'any.required': 'Please include employee roles'
    }),
    employment_type: Joi.string().valid(...employeeTypes).required().messages({
        'any.required': 'Please include employment type'
    }),
});

module.exports = {
    createEmployeeValidationSchema
}
