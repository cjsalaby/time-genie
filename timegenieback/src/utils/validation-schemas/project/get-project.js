const Joi = require('joi');

const getProjectValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    }),
});

module.exports = {
    getProjectValidationSchema
}
