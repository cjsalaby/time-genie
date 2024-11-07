const Joi = require('joi');

const createTimeChangeRequestValidationSchema = Joi.object({
    timesheet_id: Joi.number().required().messages({
        'any.required': 'Missing timesheet details'
    }),
    description: Joi.string().required().messages({
        'any.required': 'Missing time change request details',
    })
})

module.exports = {
    createTimeChangeRequestValidationSchema,
}
