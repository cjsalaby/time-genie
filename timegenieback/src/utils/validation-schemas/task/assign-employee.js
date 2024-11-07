const Joi = require('joi');

const assignEmployeeTaskValidationSchema = Joi.object({
    task_id: Joi.number().required().messages({
        'any.required': 'Please include task ID'
    }),
    username: Joi.string().required().messages({
        'any.required': 'Please include employee username'
    })
});

module.exports = {
    assignEmployeeTaskValidationSchema
}
