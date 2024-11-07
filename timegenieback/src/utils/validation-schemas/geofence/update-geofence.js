const Joi = require('joi');

const updateGeofenceValidationSchema = Joi.object({
    geofence_id: Joi.number().required().messages({
        'any.required': 'Please include geofence ID'
    }),
    geolocation: Joi.string(),
    radius: Joi.number(),
})

module.exports = {
    updateGeofenceValidationSchema,
}
