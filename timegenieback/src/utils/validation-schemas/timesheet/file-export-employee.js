const Joi = require('joi');

const fileExportEmployee = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Please include employee username'
    }),
    days: Joi.number(),
});

module.exports = {
    fileExportEmployee
}
