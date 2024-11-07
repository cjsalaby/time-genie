const Joi = require('joi');

const updateCompanyValidationSchema = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    description: Joi.string(),
    address1: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postalcode: Joi.string(),
});

module.exports = {
    updateCompanyValidationSchema
}