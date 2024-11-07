import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/timetracking`;
const startTaskTrackingTime = async (request) => {
    try {
        console.log(request);
        const token = await auth.getToken();
        return await fetch(`${url}/`, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log('Error at startTaskTrackingTime: ', err);
        throw err;
    }
};

const stopTaskTrackingTime = async (request) => {
    try {
        console.log(request);
        const token = await auth.getToken();
        return await fetch(`${url}/`, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log('Error at stopTaskTrackingTime: ', err);
        throw err;
    }
};

const getTotalTaskTime = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/task?task_id=${request}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at GetTotalTaskTime: ', err);
        throw err;
    }
}

module.exports = {
    startTaskTrackingTime,
    stopTaskTrackingTime,
    getTotalTaskTime,
};
