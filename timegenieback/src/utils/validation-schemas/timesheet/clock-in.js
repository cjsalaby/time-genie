const Joi = require('joi');

const clockInValidationSchema = Joi.object({
    geolocation: Joi.string().required().messages({
        'any.required': 'Please include geolocation coordinates'
    }),
    in_region: Joi.boolean().required().messages({
        'boolean.base': 'Invalid region configuration.',
        'any.required': 'Region configuration is required.',
    }),
    is_approved: Joi.boolean().required().messages({
        'boolean.base': 'Invalid region configuration.',
        'any.required': 'Timesheet approval is required.'
    }),
})

module.exports = {
    clockInValidationSchema,
}
