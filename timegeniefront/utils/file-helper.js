import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import auth from '../services/auth-service';
import * as Sharing from 'expo-sharing';

// Sharing library lets us share to email or download to device file system (download to device only works on IOS)

/**
 * Called to generate a file for android platform.
 *
 * @param data file data as a string (Plain text for CSV, base64 encoded for PDF)
 * @param format format of the file (CSV or PDF)
 * @returns {Promise<boolean|undefined>}
 */
const generateFileWithStorageAccessApi = async (data, format) => {
    const fileName = 'export_' + Date.now();
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
        const directory = permissions.directoryUri;
        switch (format) {
        case 'csv': {
            return downloadCsvAndroid(directory, fileName, data);
        }
        case 'pdf': {
            return downloadPdfAndroid(directory, fileName, data);
        }
        }
    }
};

/**
 * Handles downloading CSV file for android platform
 *
 * @param directory file directory
 * @param fileName file name
 * @param data file data
 * @returns {Promise<boolean>}
 */
const downloadCsvAndroid = async (directory, fileName, data) => {
    fileName += '.csv';
    try {
        await StorageAccessFramework.createFileAsync(directory, fileName, 'text/csv')
            .then(async (fileUri) => {
                await StorageAccessFramework.writeAsStringAsync(
                    fileUri, data,
                    { encoding: FileSystem.EncodingType.UTF8 }
                );
            });
        console.log('Successfully generated file');
        return true;
    } catch (error) {
        console.log('Error generating file: ', error);
        throw error;
    }
};

/**
 * Handles downloading PDF file for android platform
 *
 * @param directory file directory
 * @param fileName file name
 * @param data file data
 * @returns {Promise<boolean>}
 */
const downloadPdfAndroid = async (directory, fileName, data) => {
    fileName += '.pdf';
    try {
        await StorageAccessFramework.createFileAsync(directory, fileName, 'application/pdf')
            .then(async (fileUri) => {
                const reader = new FileReader();
                reader.onload = async () => {
                    await StorageAccessFramework.writeAsStringAsync(
                        fileUri, reader.result.split(',')[1],
                        { encoding: FileSystem.EncodingType.Base64 }
                    );
                };
                reader.readAsDataURL(data);
            });
        console.log('Successfully generated file');
        return true;
    } catch (error) {
        console.log('Error generating file: ', error);
        throw error;
    }
};

/**
 * Called to generate a file for iOS platform.
 *
 * @param URL URL for the REST endpoint to get the file
 * @param format file format (CSV or PDF)
 * @returns {Promise<boolean>}
 */
const generateFileWithSharingApi = async (URL, format) => {
    const token = await auth.getToken();
    const options = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    let filename = 'export_' + Date.now();
    switch (format) {
    case 'pdf': {
        filename += '.pdf';
        break;
    }
    case 'csv': {
        filename += '.csv';
        break;
    }
    }
    try {
        const response = await FileSystem.downloadAsync(
            URL,
            FileSystem.documentDirectory + filename,
            options
        );
        await shareAsync(response.uri);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

/**
 * Called to use the expo sharing API.
 * For iOS this allows users to either save the file to their system, or share it with other apps.
 * For android this only allows users to share the file with other apps.
 *
 * @param fileUri
 * @returns {Promise<void>}
 */
const shareAsync = async (fileUri) => {
    await Sharing.shareAsync(fileUri);
};

module.exports = {
    generateFileWithStorageAccessApi,
    generateFileWithSharingApi,
    shareAsync
};
