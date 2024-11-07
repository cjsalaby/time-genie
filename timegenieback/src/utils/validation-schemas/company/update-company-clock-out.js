const Joi = require('joi');

const updateCompanyClockOutValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Please include company name'
    }),
    cron_job: Joi.string().required().messages({
        'any.required': 'Please include cron job expression.'
    })
});

module.exports = {
    updateCompanyClockOutValidationSchema
}