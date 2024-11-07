const Joi = require('joi');

const assignEmployeeProjectValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    }),
    username: Joi.string().required().messages({
        'any.required': 'Please include employee username'
    })
});

module.exports = {
    assignEmployeeProjectValidationSchema
}
