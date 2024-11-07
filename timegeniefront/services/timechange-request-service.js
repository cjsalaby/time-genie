import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/timechange`;

const getEmployeeTimeChangeRequests = async () => {
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
        console.log('Error at getEmployeeTimeChangeRequests: ', err);
        throw err;
    }
}

const getManagerEmployeeTimeChangeRequests = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getManagerEmployeeTimeChangeRequests: ', err);
        throw err;
    }
};

const createTimeChangeRequest = async (request) => {
    try {
        const token = await auth.getToken();
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log('Error at createTimeChangeRequest: ', err);
        throw err;
    }
}

const editTimeChangeRequestApproval = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at editTimeChangeRequestApproval: ', err);
        throw err;
    }
}

module.exports = {
    getEmployeeTimeChangeRequests,
    getManagerEmployeeTimeChangeRequests,
    createTimeChangeRequest,
    editTimeChangeRequestApproval
};
