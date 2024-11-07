const Joi = require('joi');

const createGeofenceValidationSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'Please include employee username'
    }),
    geolocation: Joi.string().required().messages({
        'any.required': 'Please include geolocation coordinates'
    }),
    radius: Joi.number().required().messages({
        'any.required': 'Please include geofence radius'
    }),
})

module.exports = {
    createGeofenceValidationSchema,
}
