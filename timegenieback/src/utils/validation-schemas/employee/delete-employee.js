const Joi = require('joi');

const deleteEmployeeValidationSchema = Joi.object({
    company_name: Joi.string().required().messages({
        'any.required': 'Please include company name'
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Please include employee username'
    }),
});

module.exports = {
    deleteEmployeeValidationSchema
}
