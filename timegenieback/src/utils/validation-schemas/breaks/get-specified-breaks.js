const Joi = require('joi');

const getSpecifiedBreaksValidationSchema = Joi.object({
    emp_id: Joi.string().required().messages({
        'any.required': 'User information is missing'
    }),
});

module.exports = {
    getSpecifiedBreaksValidationSchema
}
