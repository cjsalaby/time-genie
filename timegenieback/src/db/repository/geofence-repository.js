const {Geofence} = require('../../models/geofence');

const createGeofence = async (employee_id, location, radius) => {
    return await Geofence.create({
        employee_id: employee_id,
        geolocation: location,
        radius: radius,
    });
}

const deleteGeofence = async (geofence_id) => {
    return await Geofence.destroy({
        where: {
            geofence_id: geofence_id,
        }
    })
}

const updateGeofence = async (geofence, data) => {
    if(data.geolocation) {
        geofence.set({
            geolocation: data.geolocation,
        })
    }
    if(data.radius) {
        geofence.set({
            radius: data.radius,
        })
    }

    return await geofence.save();

}

const getGeofenceByEmpID = async (employee_id) => {
    return await Geofence.findAll({
        order: [['created_at', 'DESC']],
        where: {
            employee_id: employee_id,
        }
    })
}

const getGeofenceByID = async (geofence_id) => {
    return await Geofence.findOne({
        where: {
            geofence_id: geofence_id,
        }
    })
}

module.exports = {
    createGeofence,
    getGeofenceByEmpID,
    getGeofenceByID,
    deleteGeofence,
    updateGeofence,
}
