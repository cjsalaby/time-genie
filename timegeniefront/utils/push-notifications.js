import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotifications() {
    let token;
    // this makes sure that you are running on a physical device, push notifs do not work on emu/sim.
    if(Device.isDevice) {

        if(Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: 'white',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if(existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if(finalStatus !== 'granted') {
            alert('Failed to get token for push notifications.');
            return;
        }

        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        })
        console.log('Token: ', token);
    } else {
        console.log('Push notifications only supported on physical devices.');
        return;
    }
    return token.data;
}

async function pushNotification(message) {
    await Notifications.scheduleNotificationAsync({
        content: message,
        trigger: null,
    })
}


module.exports = {
    registerForPushNotifications,
    pushNotification,
}


