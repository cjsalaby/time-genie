const GeofenceService = require('../../services/geofence-service');

/**
 * Takes in employee_id, location(lat,long), radius to create a geofence.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const createGeofence = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const response = await GeofenceService.createGeofence(user, request);
        return res.status(200).json(response);

    } catch (e) {
        console.error(e);
        return next(e);
    }

}

/**
 * Deletes a geofence given a geofence_id.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const deleteGeofence = async (req, res, next) => {
    try {
        const query = req.query;
        const response = await GeofenceService.deleteGeofence(query);
        return res.status(200).json(response);

    } catch (e) {
        console.error(e);
        return next(e);
    }

}

/**
 * Selects a geofence and updates the parameters.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const updateGeofence = async (req, res, next) => {
    try{
        const body = req.body;
        const response = await GeofenceService.updateGeofence(body);
        return res.status(200).json(response);

    } catch (e) {
        console.error(e);
        return next(e);
    }

}

/**
 * Gets the geofenced areas for the current user
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getSelfGeofence = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await GeofenceService.getSelfGeofence(user);
        return res.status(200).json(response);

    } catch (e) {
        console.error(e);
        return next(e);
    }
}

/**
 * Gets the geofenced areas for the queried user
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getGeofenceById = async (req, res, next) => {
    try {
        const user = req.user;
        const query = req.query;
        const response = await GeofenceService.getGeofenceById(query, user);
        return res.status(200).json(response);

    } catch (e) {
        console.error(e);
        return next(e);
    }
}

module.exports = {
    createGeofence,
    deleteGeofence,
    updateGeofence,
    getSelfGeofence,
    getGeofenceById
}
