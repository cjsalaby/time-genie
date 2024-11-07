const Joi = require('joi');

const addApprovalValidationSchema = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Missing timesheet details'
    }),
    approval: Joi.boolean().required().messages({
        'boolean.base': 'Invalid approval configuration.',
        'any.required': 'Approval configuration is required.',
    })
})

module.exports = {
    addApprovalValidationSchema,
}
