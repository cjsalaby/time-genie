const Joi = require('joi');

const createTaskValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    }),
    name: Joi.string().required().messages({
        'any.required': 'Please include a task name'
    }),
    description: Joi.string(),
});

module.exports = {
    createTaskValidationSchema
}
