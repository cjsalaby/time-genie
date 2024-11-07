import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput, Linking, TouchableOpacity, Alert, Platform} from 'react-native';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontSize, Border } from '../assets/GlobalStyles.js';
import { Image } from 'expo-image';
import auth from '../services/auth-service';
import {loadFonts} from "../assets/fonts-helper";
import LoginService from '../services/login-service';
import LocalAuthentication from '../utils/local-authentication';
const profile_icon = require('../assets/profile.png');
const biometric_icon = require('../assets/biometric.svg');

const MobileLogin = () => {
    const [fontsLoaded] = loadFonts();
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [company, setCompany] = useState('');
    const [password, setPassword] = useState('');
    const [entry, setEntry] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');

    const resetState = () => {
        setUsername('');
        setCompany('');
        setPassword('');
        setError(false);
        setMessage(null);
    }

    const onSubmitHandler = async () => {

        if (entry) {
            const payload = {
                username,
                company_name: company,
                password
            };
            const response = await LoginService.login(payload);
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            if (!response.ok) {
                setError(true);
                setMessage(jsonResponse.message);
            } else {
                setError(false);
                setMessage(null);
                try {
                    // await SecureStore.setItemAsync('token', jsonResponse.token);
                    // const token = await SecureStore.getItemAsync('token');

                    // storing the token in the secure storage using the auth-service
                    // so that we can access the user info from everywhere after logging in
                    await auth.storeToken(jsonResponse.token);
                } catch (err) {
                    console.log(err);
                }
                /*
                      The following is how you can retrieve the token in the future:
                      const token = await SecureStore.getItemAsync('token');
                      console.log(token);
                       */
                if (jsonResponse.roles.includes('MANAGER')) {
                    navigation.navigate('manager');
                } else {
                    navigation.navigate('employee');
                }
                setUsername('');
                setCompany('');
                setPassword('');
            }
        } else {
            setError(true);
            setMessage('Must accept Privacy Policy');
        }
    };

    const handleLocalAuthentication = async () => {

        if(!await LocalAuthentication.hasHardware()) {
            Alert.alert('Error', 'This device does not support biometric authentication.')
            return;
        }
        if(!await LocalAuthentication.hasBiometric()) {
            Alert.alert('Error', 'This device does no contain biometric data. Enroll biometric data using the device\'s security settings')
            return;
        }
        if(!await auth.tokenExpirationIsValid()) {
            Alert.alert('Error', 'Invalid session. Please re-log with username and password.');
            return;
        }

        const fingerprintAuth = await LocalAuthentication.fingerprintAuth();

        if(!fingerprintAuth.success) {
            if(fingerprintAuth.error === 'user_cancel') {
                return;
            } else {
                Alert.alert('Error', 'Fingerprint authentication failed.');
                return;
            }
        }
        const token = await auth.getToken();
        const decodedToken = await auth.decode(token);
        if(decodedToken.roles.includes('MANAGER')) {
            navigation.navigate('manager');
        } else {
            navigation.navigate('employee');
        }
        resetState();
    }

    const getMessage = () => {
        const status = error ? 'Error: ' : 'Success: ';
        return status + message;
    };

    if (!fontsLoaded) {
    } else {
        return (
            <View style={[styles.background, { backgroundColor: '#171A21', flex: 1 }]}>
                <Image source={profile_icon} style={styles.image} />
                <View style={styles.center}>

                    <TextInput
                        label="Username"
                        style={styles.input}
                        placeholderTextColor='lightgray'
                        placeholder="Username"
                        onChangeText={setUsername}
                        value={username}
                    />
                    <TextInput
                        label="Company"
                        style={styles.input}
                        placeholderTextColor='lightgray'
                        placeholder="Company"
                        onChangeText={setCompany}
                        value={company}
                    />
                    <TextInput
                        label="Password"
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor='lightgray'
                        onChangeText={setPassword}
                        Color='white'
                        placeholder="Password"
                        value={password}
                    />
                    <View style={styles.section}>
                        <Checkbox
                            style={styles.checkbox}
                            value={entry}
                            onValueChange={setEntry}
                        />
                        <Text style={{ color: 'lightgray' }}>I agree to the Terms of Service</Text>
                    </View>
                    <Text style={{ color: 'lightgray' }}>and Privacy Policy</Text>
                    <Text
                        style={[styles.message, { color: error ? 'red' : 'green' }]}>
                        {message ? getMessage() : null}
                    </Text>
                    <TouchableOpacity style={styles.button}
                        onPress={onSubmitHandler}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLocalAuthentication}>
                        {
                            (Platform.OS === 'android' ?
                                <Icon name='fingerprint' color='white' size={80} style={{marginTop: 15}}/>:
                                <Image source={biometric_icon} style={styles.bioImage} />)
                        }
                    </TouchableOpacity>

                    <Text style={[styles.Privacy, { color: 'lightgray' }]}
                        onPress={() => Linking.openURL('http://google.com')}>
                        Privacy Policy
                    </Text>
                    <Text style={[styles.Terms, { color: 'lightgray' }]}
                        onPress={() => Linking.openURL('http://google.com')}>
                        Terms of Service
                    </Text>

                </View>
                <StatusBar style="auto" />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    image: {
        margin: 25,
        padding: 25,
        width: '20%',
        height: '15%',
        borderRadius: 15,
        alignSelf: "center"
    },
    bioImage: {
        margin: 10,
        paddingVertical: 70,
        paddingHorizontal: 60,
        alignSelf: "center"
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    input: {
        width: '60%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        padding: 10,
        fontSize: 16,
        minHeight: 40,
        backgroundColor: '#2A475E',
        fontFamily: 'Poppins_300Light',
        // #E2DBD9 use for old color text boxes i feel looks better
        margin: 5,
        borderRadius: Border.br_7xs,
        color: 'lightgrey'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        color: 'lightgray'
    },
    checkbox: {
        margin: 5,
        backgroundColor: '#2A475E',
        color: 'white'
    },
    button: {
        margin: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 32,
        elevation: 3,
        backgroundColor: '#35bd40',
        borderRadius: Border.br_7xs,
        width: '45%',
        height: '8%'
    },
    text: {
        fontSize: FontSize.size_5xl,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white'
    },
    message: {
        fontSize: 16,
        fontFamily: 'Poppins_300Light'
    },
    CheckText: {
        fontSize: 16,
        color: 'lightgray',
        fontFamily: 'Poppins_300Light'
    },
    Privacy: {
        fontSize: 16,
        color: 'lightgray',
        fontFamily: 'Poppins_300Light',
        marginTop: 30,
        textDecorationLine: 'underline'
    },
    Terms: {
        fontSize: 16,
        color: 'lightgray',
        fontFamily: 'Poppins_300Light',
        textDecorationLine: 'underline'
    }
});

export default MobileLogin;
