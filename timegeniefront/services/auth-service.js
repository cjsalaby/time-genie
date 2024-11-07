import * as SecureStore from 'expo-secure-store';
import jwt from 'expo-jwt';

const TOKEN_KEY = 'dont-tell-anyone-our-secret!';
const STORAGE_KEY = 'oursecret';
const storeToken = async (token) => {
    try {
        await SecureStore.setItemAsync(STORAGE_KEY, token);
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const getToken = async () => {
    try {
        return await SecureStore.getItemAsync(STORAGE_KEY);
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const decode = async (token) => {
    try {
        return jwt.decode(token, TOKEN_KEY);
    } catch (err) {
        console.log('Error ', err);
        throw err;
    }
}

const tokenExpirationIsValid = async () => {
    try {
        const token = await getToken();
        const decodedToken = await decode(token);
        return Date.now() < decodedToken.exp * 1000;
    } catch (e) {
        return false;
    }
}

const getUserInfo = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return null;
        }
        return await jwt.decode(token, TOKEN_KEY, { timeSkew: 30 });
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

module.exports = {
    storeToken,
    getToken,
    getUserInfo,
    decode,
    tokenExpirationIsValid,
};
