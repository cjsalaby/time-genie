const Joi = require('joi');

const getProjectTasksValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    })
});

module.exports = {
    getProjectTasksValidationSchema
}
