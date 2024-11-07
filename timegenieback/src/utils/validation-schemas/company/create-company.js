const Joi = require('joi');

const createCompanyValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Please include company name'
    }),
    phone: Joi.string().required().messages({
        'any.required': 'Please include company phone number'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Please include company email'
    }),
    description: Joi.string().messages({
        'any.required': 'Please include company description'
    }),
    address1: Joi.string().required().messages({
        'any.required': 'Please include street address'
    }),
    city: Joi.string().required().messages({
        'any.required': 'Please include city'
    }),
    state: Joi.string().required().messages({
        'any.required': 'Please include state'
    }),
    country: Joi.string().required().messages({
        'any.required': 'Please include country'
    }),
    postalcode: Joi.string().required().messages({
        'any.required': 'Please include postal code'
    }),
});

module.exports = {
    createCompanyValidationSchema
}
