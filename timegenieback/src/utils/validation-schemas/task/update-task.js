const Joi = require('joi');
const {taskStatuses} = require('../../../models/task');

const updateTaskValidationSchema = Joi.object({
    task_id: Joi.number().required().messages({
        'any.required': 'Please include task ID'
    }),
    name: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    status: Joi.string().valid(...taskStatuses).allow(null)
});

module.exports = {
    updateTaskValidationSchema
}
