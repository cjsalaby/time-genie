import React, {useEffect, useState} from 'react';
import {Card} from 'react-native-paper';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import LoadingScreen from '../components/LoadingScreen';
import EmployeeService from '../services/employee-service';
import GeofenceService from '../services/geofence-service';
import {Dropdown} from 'react-native-element-dropdown';
import Slider from '@react-native-community/slider';
import {getLocation, getAddress} from '../utils/location-helper'
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";
const METERS_CONVERSION = 1610;

const ManagerGeofencePage = () => {
    const [fontsLoaded] = loadFonts();
    const [appIsReady, setAppIsReady] = useState(false);
    const [location, setLocation] = useState(null);
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [marker, setMarker] = useState(null);
    const [radiusSliderValue, setRadiusSliderValue] = useState(0.1);
    const [initialLocation, setInitialLocation] = useState(null);
    const [address, setAddress] = useState(null);

    const getInitialLocation = async () => {
        const location = await getLocation();
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
        };
    }

    async function fetchData () {
        try {
            const empData = await EmployeeService.getEmployees();
            setEmployeeData(empData);
            const location = await getInitialLocation();
            setInitialLocation(location);
        } catch (e) {
            console.error(e);
        } finally {
            setAppIsReady(true);
        }
    }

    async function fetchEmployeeData () {
        const empData = await EmployeeService.getEmployees();
        setEmployeeData(empData);
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData().catch((e) => {
               console.log(e);
            });
        }, [])
    )

    if (!appIsReady) {
        return <LoadingScreen />;
    }

    const formatAddress = (address) => {
        const addressObject = address[0]
        return `${addressObject.streetNumber} ${addressObject.street}, ${addressObject.city}, ${addressObject.region} ${addressObject.postalCode}`

    }

    const handleMapPress = async (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        const locationString = `${latitude}, ${longitude}`;
        setMarker({
            latitude,
            longitude
        });
        setLocation(locationString);
        try {
            const addressObject = await getAddress(latitude, longitude);
            if(addressObject) {
                const formattedAddress = formatAddress(addressObject);
                setAddress(formattedAddress);
            } else {
                setAddress('Address not found.');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const validateRequest = async (username, geolocation, radius) => {
        const isValidUsername = username !== null && username !== '';
        const isValidGeolocation = geolocation !== null & geolocation !== '';
        const isValidRadius = radius > 0 && radius !== null;
        return isValidUsername && isValidGeolocation && isValidRadius;
    };

    const convertMilesToMeters = async (miles) => {
        return Math.ceil(miles * METERS_CONVERSION);
    }

    const resetSelection = () => {
        setSelectedEmployee(null);
        setRadiusSliderValue(0.1);
        setMarker(null);
    }

    const handleCreateGeofencePress = async () => {
        if (!await validateRequest(selectedEmployee, location, radiusSliderValue)) {
            Alert.alert('Invalid Input', 'Employee, radius, and geolocation are required. Please check your inputs.');
            return;
        }

        const radius = await convertMilesToMeters(radiusSliderValue);
        const request = {
            username: selectedEmployee,
            geolocation: location,
            radius: radius,
        };

        const res = await GeofenceService.createGeofence(request);
        if (res.status === 200) {
            Alert.alert('Success', `Created a geofence at ${address}`);
        } else {
            Alert.alert('Error', 'Server error, try again later.');
        }
        resetSelection();
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card} >
                <Card.Content>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        placeholder='Select Employee'
                        search
                        searchPlaceholder="Search..."
                        data={employeeData}
                        labelField='first_name'
                        valueField='username'
                        value={selectedEmployee}
                        onChange={ item => {
                            setSelectedEmployee(item.username);
                        }}
                        onFocus={() => {
                            fetchEmployeeData();
                        }}
                    />
                    <View style={styles.radius}>
                        <Text style={styles.text}>Geofence radius:</Text>
                    </View>

                    <View style={styles.sliderView}>
                        <Slider style={styles.slider}
                                minimumValue={0.05} maximumValue={2}
                                step={0.05}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                value={radiusSliderValue}
                                onValueChange={(value) =>
                                    setRadiusSliderValue(parseFloat(value.toFixed(2)))
                                }
                        />
                        <Text style={styles.text}>{radiusSliderValue}
                            {radiusSliderValue === 1.00 ? ' mile' : ' miles'}</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleCreateGeofencePress}>
                        <Text style={styles.text}>CREATE GEOFENCE</Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialLocation}
                showsUserLocation
                showsMyLocationButton
                onPress={handleMapPress}
            >
                {marker && (
                    <>
                        <Circle
                            center={{
                                latitude: marker.latitude, longitude: marker.longitude }}
                            radius={radiusSliderValue * METERS_CONVERSION}
                            strokeColor={'#35bd40'}
                            strokeWidth={4}
                        />
                        <Marker coordinate={{
                            latitude: marker.latitude, longitude: marker.longitude
                        }}
                        />
                    </>

                )}

            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171A21',
        alignItems: 'center'
    },
    button: {
        padding: 8,
        borderRadius: 2,
        alignItems: 'center',
        backgroundColor: '#35bd40',
        width: '100%',
        marginTop: '5%'
    },
    radius: {
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    slider: {
        width: '75%',
        height: 30
    },
    sliderView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: 'white',
        marginVertical: 8,
        fontFamily: 'Poppins_300Light'
    },
    card: {
        backgroundColor: '#2A475E',
        width: '95%',
        margin: 10,
        borderRadius: 5
    },
    map: {
        zIndex: -1,
        width: '95%',
        height: '60%',
    },
    dropdown: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    placeholderStyle: {
        fontSize: 16,
        backgroundColor: 'white'
    },
});

export default ManagerGeofencePage;
