const Joi = require('joi');

const createProjectValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Please include a project name'
    }),
    description: Joi.string().messages({
        'any.required': 'Please include a project description'
    }),
});

module.exports = {
    createProjectValidationSchema
}
