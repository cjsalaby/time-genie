const Joi = require('joi');
const {projectStatuses, projectHealths, projectPhases} = require('../../../models/project')

const updateProjectValidationSchema = Joi.object({
    project_id: Joi.number().required().messages({
        'any.required': 'Please include project ID'
    }),
    name: Joi.string(),
    description: Joi.string(),
    status: Joi.string().valid(...projectStatuses),
    health: Joi.string().valid(...projectHealths),
    phase: Joi.string().valid(...projectPhases)
});

module.exports = {
    updateProjectValidationSchema
}
