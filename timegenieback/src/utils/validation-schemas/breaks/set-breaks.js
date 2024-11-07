const Joi = require('joi');

const setBreaksValidationSchema = Joi.object({
    emp_id: Joi.string().min(3).required().messages({
        'any.required': 'User information is missing'
    }),
    max_breaks: Joi.number().required().messages({
        'any.required': 'Missing max breaks'
    }),
    break_duration: Joi.number().required().messages({
        'any.required': 'Missing break duration'
    }),
});

module.exports = {
    setBreaksValidationSchema
}
