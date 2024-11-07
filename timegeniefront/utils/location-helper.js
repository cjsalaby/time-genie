import * as Location from 'expo-location';

const GEOFENCE_TASK = 'REAL_GEOFENCE_TASK';
const TRACKING_TASK = 'TRACKING_TASK';

const requestBackgroundPermission = async () => {
    try {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            console.log('Background permissions were denied');
        }
    } catch (error) {
        console.error(error);
    }
};

const requestForegroundPermission = async () => {
    try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            console.log('Foreground permissions were denied');
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * this gets the current location of a user when they are clocking out, i have set a timeout limit incase the request hangs.
 * hanging usually only happens on the android emulator.
 * Now will attempt to fetch the location up to 3 times before finally timing out.
 * @returns {Promise<boolean|string>}
 */
const getLocation = async (retry = 3) => {
    try {
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 3000);
        });

        return await Promise.race([
            Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High}),
            timeoutPromise
        ]);

    } catch (error) {
        if(retry > 0) {
            console.log(`Attempting getCurrentPositionAsync again, attempts left: ${retry}`);
            return getLocation(retry - 1);
        }
        console.error(error);
    }
};

/**
 * this tracks the users current location, updates every 10 meters the user moves. or 10 seconds.
 * @returns {Promise<void>}
 */
const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(TRACKING_TASK, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
        timeInterval: 10000
    });
};

/**
 * after fetching the geofence data from the server it then creates a geofence.
 * gets the first or latest geofence data
 * @param geofence_data
 * @returns {Promise<void>}
 */
const startGeofencing = async (geofence_data) => {
    try {
        if (geofence_data.isEmpty) {
            console.log('empty geofence data');
            return;
        }

        // you can modify this however youd like for testing or debugging to move around the geofence.
        const region = [{
            identifier: `test_geofence_id_${geofence_data[0].geofence_id}`,
            latitude: geofence_data[0].geolocation.x,
            longitude: geofence_data[0].geolocation.y,
            radius: geofence_data[0].radius,
            notifyOnEnter: true,
            notifyOnExit: true
        }];

        await Location.startGeofencingAsync(GEOFENCE_TASK, region);
    } catch (error) {
        console.log(error);
    }
};

const getAddress = (latitude, longitude) => {
    try {
        return Location.reverseGeocodeAsync({
            latitude: latitude,
            longitude: longitude,
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getLocation,
    startGeofencing,
    requestBackgroundPermission,
    requestForegroundPermission,
    startLocationTracking,
    getAddress,
};
