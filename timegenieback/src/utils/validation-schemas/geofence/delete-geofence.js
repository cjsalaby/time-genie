const Joi = require('joi');

const deleteGeofenceValidationSchema = Joi.object({
    geofence_id: Joi.number().required().messages({
        'any.required': 'Please include geofence ID'
    }),
})

module.exports = {
    deleteGeofenceValidationSchema,
}
