const Joi = require('joi');

const updateCompanyTimezoneValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Please include company name'
    }),
    timezone: Joi.string().required().messages({
        'any.required': 'Please include timezone'
    })
});

module.exports = {
    updateCompanyTimezoneValidationSchema
}