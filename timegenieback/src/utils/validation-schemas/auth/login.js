const Joi = require('joi');

const loginValidationSchema = Joi.object({
    username: Joi.string().alphanum().required().messages({
        'any.required': 'Please include Username'
    }),
    company_name: Joi.string().alphanum().required().messages({
        'any.required': 'Please include Company Name'
    }),
    password: Joi.string().alphanum().required().messages({
        'any.required': 'Please include Password'
    }),
});

module.exports = {
    loginValidationSchema
}
