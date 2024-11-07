const API_URL = process.env.API_URL;
console.log('API_URL:', API_URL);
const url = `${API_URL}/api/login`;

const login = async (request) => {
    try {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request),
            mode: 'cors'
        });
    } catch (err) {
        console.log('Error at login: ', err);
    }
};

export default {
    login
};
