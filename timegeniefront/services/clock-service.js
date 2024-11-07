import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/timesheet`;

const clockIn = async (geolocation) => {
    try {
        const token = await auth.getToken();
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(geolocation),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log(err);
    }
};

const clockOut = async (geolocation) => {
    try {
        const token = await auth.getToken();
        await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(geolocation),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (err) {
        console.log(err);
    }
};

const latestRecord = async () => {
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
        const resData = await response.json();
        return resData.clock_out_time === null;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    clockIn,
    clockOut,
    latestRecord
};
