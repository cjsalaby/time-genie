const Joi = require('joi');

const deleteProjectValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    }),
});

module.exports = {
    deleteProjectValidationSchema
}
