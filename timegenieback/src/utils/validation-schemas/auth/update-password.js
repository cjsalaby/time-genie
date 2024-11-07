const Joi = require('joi');

const updatePasswordValidationSchema = Joi.object({
    password: Joi.string().alphanum().required().messages({
        'any.required': 'Please include old password'
    }),
    new_password: Joi.string().alphanum().required().messages({
        'any.required': 'Please include new password'
    })
});

module.exports = {
    updatePasswordValidationSchema
}
