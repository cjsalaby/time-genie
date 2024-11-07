const Joi = require('joi');

const editTimesheetValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Please include employee username'
    }),
    timesheet_id: Joi.number().required().messages({
        'any.required': 'Please include timesheet ID'
    }),
    clock_in: Joi.string().allow(null, ''),
    clock_out: Joi.string().allow(null, ''),
    is_approved: Joi.boolean().allow(null),
});

module.exports = {
    editTimesheetValidationSchema
}
