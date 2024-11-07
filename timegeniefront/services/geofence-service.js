import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/geofence`;

const getGeofence = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getEmployees: ', err);
    }
};

const createGeofence = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return response;
    } catch (err) {
        console.log('Error at createGeofence: ', err);
    }
};

module.exports = {
    getGeofence,
    createGeofence
};
