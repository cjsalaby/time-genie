const Joi = require('joi');

const editBreaksRemainingValidationSchema = Joi.object({
    emp_id: Joi.string().min(3).required().messages({
        'any.required': 'User information is missing'
    }),
    breaks_remaining: Joi.number().required().messages({
        'any.required': 'Breaks information is missing'
    })
});

module.exports = {
    editBreaksRemainingValidationSchema
}
