import * as LocalAuthentication from 'expo-local-authentication';

const hasHardware = async () => {
    return await LocalAuthentication.hasHardwareAsync();
}

const hasBiometric = async () => {
    return await LocalAuthentication.isEnrolledAsync();
}

const fingerprintAuth = async () => {
    return await LocalAuthentication.authenticateAsync();
}

const cancel = async () => {
    return await LocalAuthentication.cancelAuthenticate();
}


module.exports = {
    hasHardware,
    hasBiometric,
    fingerprintAuth,
    cancel,
}