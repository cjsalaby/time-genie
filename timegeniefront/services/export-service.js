import auth from '../services/auth-service';
import fileHelper from '../utils/file-helper';
import { Platform } from 'react-native';
const API_URL = process.env.API_URL;
const url = `${API_URL}/api/timesheet`;

const allEmployeesUsingStorageAccessApi = async (days, format) => {
    try {
        console.log(`${url}/${format}?days=${days}`);
        const token = await auth.getToken();
        const response = await fetch(`${url}/${format}?days=${days}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await fileHelper.generateFileWithStorageAccessApi(
            format === 'pdf'? await response.blob() : await response.text(),
            format);
    } catch (error) {
        console.log('Error at getCSVData ', error);
        throw (error);
    }
};

const singleEmployeeUsingStorageAccessApi = async (username, days, format) => {
    try {
        console.log(`${url}/${format}/employee?username=${username}&days=${days}`);
        const token = await auth.getToken();
        const response = await fetch(`${url}/${format}/employee?username=${username}&days=${days}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await fileHelper.generateFileWithStorageAccessApi(
            format === 'pdf'? await response.blob() : await response.text(),
            format);
    } catch (error) {
        console.log('Error at getCSVData ', error);
        throw (error);
    }
};

/**
 * Download CSV data for all employees, and show expo-sharing popup.
 * iOS - Works for file sharing and file download.
 * Android - Only for file sharing, not file download.
 *
 * @param days
 * @param format
 * @returns {Promise<boolean>}
 */
const allEmployeesUsingSharingApi = async (days, format) => {
    try {
        console.log(`${url}/${format}?days=${days}`);
        return await fileHelper.generateFileWithSharingApi(`${url}/${format}?days=${days}`, format);
    } catch (error) {
        console.log('Error at downloadCSVData ', error);
        throw (error);
    }
};

const singleEmployeeUsingSharingApi = async (username, days, format) => {
    try {
        console.log(`${url}/${format}/employee?username=${username}&days=${days}`);
        return await fileHelper.generateFileWithSharingApi(`${url}/${format}/employee?username=${username}&days=${days}`, format);
    } catch (error) {
        console.log('Error at downloadEmployeePdfData ', error);
        throw (error);
    }
};

const downloadData = async (days, format, sendEmail) => {
    format = format.toLowerCase();
    if (Platform.OS === 'android') {
        if (sendEmail) {
            return await allEmployeesUsingSharingApi(days, format);
        }
        return await allEmployeesUsingStorageAccessApi(days, format);
    } else if (Platform.OS === 'ios') {
        return await allEmployeesUsingSharingApi(days, format);
    }
    console.log('Platform unsupported');
    return false;
};

const downloadEmployeeData = async (username, days, format, sendEmail) => {
    format = format.toLowerCase();
    if (Platform.OS === 'android') {
        if (sendEmail) {
            return await singleEmployeeUsingSharingApi(username, days, format);
        }
        return await singleEmployeeUsingStorageAccessApi(username, days, format);
    } else if (Platform.OS === 'ios') {
        return await singleEmployeeUsingSharingApi(username, days, format);
    }
    console.log('Platform unsupported');
    return false;
};

module.exports = {
    downloadData,
    downloadEmployeeData
};
