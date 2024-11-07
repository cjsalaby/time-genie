import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/employee`;

const getEmployees = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/manager`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (err) {
        console.log('Error at getEmployees: ', err);
        throw err;
    }
};

const createEmployee = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return response;
    } catch (err) {
        console.log('Error at createEmployee ', err);
        throw err;
    }
};

const updateEmployee = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return response;
    } catch (err) {
        console.log('Error at updateEmployee ', err);
        throw err;
    }
};

const getLatestEmployee = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getLatestEmployee ', err);
        throw err;
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    getLatestEmployee
};
