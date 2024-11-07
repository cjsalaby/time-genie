const Joi = require('joi');

const getEmpTimesheetValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Please include employee username'
    }),
})

module.exports = {
    getEmpTimesheetValidationSchema,
}
