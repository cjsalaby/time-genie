import React, {useEffect, useState} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, View} from "react-native";
import geofenceService from "../services/geofence-service";
import LoadingScreen from '../components/LoadingScreen';
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";

const EmployeeGeofencePage = () => {
    const [fontsLoaded] = loadFonts();
    const [appIsReady, setAppIsReady] = useState(false);
    const [geofence, setGeofence] = useState(null);

    async function fetchData () {
        try {
            const geofenceData = await geofenceService.getGeofence();
            setGeofence(geofenceData);
        } catch (error) {
            console.warn(error)
        } finally {
            setAppIsReady(true);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData().catch((e) => {
               console.warn(e);
            });
        }, [])
    )

    if (!appIsReady) {
        return <LoadingScreen />;
    }

    const initLocation = {
        latitude: geofence[0].geolocation.x,
        longitude: geofence[0].geolocation.y,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
                initialRegion={initLocation}
                >
                {geofence && (
                    <Circle
                        center={{
                        latitude: geofence[0].geolocation.x,
                        longitude: geofence[0].geolocation.y,
                        }}
                        radius={geofence[0].radius}
                        strokeColor={'#35bd40'}
                        strokeWidth={4}
                    />
                )}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171A21',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    map: {
        zIndex: -1,
        width: '95%',
        height: '95%',
    },
});

export default EmployeeGeofencePage;
