const GeofenceRepo = require('../db/repository/geofence-repository');
const EmployeeRepo = require('../db/repository/employee-repository');
const {notFoundError, badRequestError} = require("../utils/errors-helper");
const {REMOTE} = require("../constants/roles");

const createGeofence = async (user, request) => {
    const employee = await EmployeeRepo.getEmployee(request.username, user.company);
    if(!employee) {
        notFoundError(`Employee: ${request.username} was not found.`);
    } else if (employee.roles.includes(REMOTE)) {
        badRequestError('Cannot create geofence for remote employee');
    }

    return await GeofenceRepo.createGeofence(employee.emp_id, request.geolocation, request.radius);
}

const deleteGeofence = async (query) => {
    const geofence = GeofenceRepo.getGeofenceByID(query.geofence_id);
    if(!geofence) {
        return notFoundError(`Geofence with id: ${query.geofence_id} does not exist`)
    }
    await GeofenceRepo.deleteGeofence(query.geofence_id);
    return {
        message: `Successfully deleted geofence with id: ${query.geofence_id}`,
    };
}

const updateGeofence = async (body) => {
    const geofence = await GeofenceRepo.getGeofenceByID(body.geofence_id);
    if(!geofence) {
        return notFoundError(`could not find geofence with id: ${body.geofence_id}`);
    }

    return await GeofenceRepo.updateGeofence(geofence, body);
}

const getSelfGeofence = async (user) => {
    const employee = await EmployeeRepo.getEmployee(user.username, user.company);
    if(!employee) {
        notFoundError(`Employee: ${user.username} was not found`);
    }
    return await GeofenceRepo.getGeofenceByEmpID(employee.emp_id);
}

const getGeofenceById = async (query, user) => {
    const employee = await EmployeeRepo.getEmployeeByIdAndCompany(query.emp_id, user.company);
    if(!employee) {
        notFoundError(`Employee: ${query.emp_id} was not found`);
    }
    else if (employee.roles.includes(REMOTE)) {
        badRequestError('Cannot get geofence for remote employee');
    }
    return await GeofenceRepo.getGeofenceByEmpID(employee.emp_id);
}

module.exports = {
    createGeofence,
    getSelfGeofence,
    getGeofenceById,
    deleteGeofence,
    updateGeofence,
}
