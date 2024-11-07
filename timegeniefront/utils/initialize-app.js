import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { requestForegroundPermission, requestBackgroundPermission } from './location-helper';
import {
    registerForPushNotifications,
    pushNotification
} from './push-notifications';

const GEOFENCE_TASK = 'REAL_GEOFENCE_TASK';
const TRACKING_TASK = 'TRACKING_TASK';
global.inRegion = false;


export async function initializeApp() {
    try {
        await requestBackgroundPermission();

        await requestForegroundPermission();

        let token = null;
        if(Device.isDevice) {
            token = await registerForPushNotifications();
        }


        TaskManager.defineTask(GEOFENCE_TASK, async ({ data: { eventType, region }, error }) => {
            console.log('GEOFENCE BACKGROUND TASK:');
            if (error) {
                console.error(error);
            }
            if (eventType === Location.GeofencingEventType.Enter) {
                console.log('You are currently in the region: ', region);
                if (Device.isDevice) {
                    const message = {
                        to: token.data,
                        sound: 'default',
                        title: 'Entered Geofence',
                        body: 'You have entered the geofence area.',
                    }
                    await pushNotification(message);
                }
                global.inRegion = true;

            } else if (eventType === Location.GeofencingEventType.Exit) {
                console.log('You are not in the region: ', region);
                if (Device.isDevice) {
                    const message = {
                        to: token.data,
                        sound: 'default',
                        title: 'Exited Geofence',
                        body: 'You have exited the geofence area.',
                    }
                    await pushNotification(message);
                }
                global.inRegion = false;
            }
        });

        TaskManager.defineTask(TRACKING_TASK, async (data, error) => {
            console.log('TRACKING BACKGROUND TASK:');
            if (error) {
                console.error(error);
            }
            if (data) {
                console.log(JSON.stringify(data));
            }
        });

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}
