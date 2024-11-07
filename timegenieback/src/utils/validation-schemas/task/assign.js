const Joi = require('joi');

const assignTaskValidationSchema = Joi.object({
    task_id: Joi.number().required().messages({
        'any.required': 'Please include task ID'
    }),
});

module.exports = {
    assignTaskValidationSchema
}
