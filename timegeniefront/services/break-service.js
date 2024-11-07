import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/break`;

const getBreaks = async () => {
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

const getLatestBreak = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url + '/latest', {
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

const setFlagInfo = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url + '/flag', {
            method: 'patch',
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

const startBreak = async () => {
    try {
        const token = await auth.getToken();
        return await fetch(url, {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const stopBreak = async () => {
    try {
        const token = await auth.getToken();
        return await fetch(url, {
            method: 'Patch',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const getBreakInfo = async () => {
    try {
        const token = await auth.getToken();
        const res = await fetch(`${url}/info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors',
        });
        return await res.json();
    } catch (e) {
        console.log('Error at getBreakInfo: ', e);
        throw e;
    }
}

const editBreaksRemaining = async (request) => {
    try {
        const token = await auth.getToken();
        return await fetch(`${url}/remaining`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(request),
            mode: 'cors'
        });
    } catch (e) {
        console.log('Error at editBreaksRemaining: ', e);
        throw e;
    }
}

module.exports = {
    getBreaks,
    getLatestBreak,
    startBreak,
    stopBreak,
    getBreakInfo,
    setFlagInfo,
    editBreaksRemaining
};
