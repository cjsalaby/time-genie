import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/timesheet`;

const getTimesheets = async () => {
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
        console.log('Error: ', err);
        throw err;
    }
};

const getEmployeeTimesheets = async (username) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/employee?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getEmployeeTimesheets: ', err);
        throw err;
    }
};

const getTotalHours = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/total`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const editEmployeeTimesheets = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/edit`, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at editEmployeeTimesheets: ', err);
        throw err;
    }
};

module.exports = {
    getTimesheets,
    getTotalHours,
    getEmployeeTimesheets,
    editEmployeeTimesheets
};
