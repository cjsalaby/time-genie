const Joi = require('joi');

const getProjectTimeValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    }),
});

module.exports = {
    getProjectTimeValidationSchema
}
