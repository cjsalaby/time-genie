import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Clock from 'react-live-clock';
import auth from '../services/auth-service';
import clockService from '../services/clock-service';
import breakService from '../services/break-service';
import timesheetService from '../services/timesheet-service';
import projectService from '../services/project-service';
import taskService from '../services/task-service';
import geofenceService from '../services/geofence-service';
import { FontSize, Border } from '../assets/GlobalStyles.js';
import HighlightButton from '../components/HighlightButton';
import HighlightButtonClock from '../components/HighlightButtonClock';
import CurrentDate from '../components/DateComponent';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen';
import { getLocation, startGeofencing, startLocationTracking } from '../utils/location-helper';
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";
global.clockedIn = false;
global.onBreak = false;

const EmployeeDashboard = () => {
    const [fontsLoaded] = loadFonts();
    const [appIsReady, setAppIsReady] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [clockButtonText, setClockButtonText] = useState('fetching');
    const [clockButtonPressed, setClockButtonPressed] = useState(false);
    const [breakButtonText, setBreakButtonText] = useState('Start break');
    const [breakButtonPressed, setBreakButtonPressed] = useState(false);
    const [sevenDays, setSevenDays] = useState('');
    const [thirtyDays, setThirtyDays] = useState('');
    const [latestProject, setLatestProject] = useState('fetching');
    const [latestTask, setLatestTask] = useState('fetching');
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [breakIsLoading, setBreakIsLoading] = useState(false);
    const [latestLocation, setLatestLocation] = useState(null);
    const [isOnBreak, setIsOnBreak] = useState(null);
    const [breakInfo, setBreakInfo] = useState(null);
    const [isOnGrace, setIsOnGrace] = useState(null);

    async function fetchClockData () {
        const employeeClockInfo = await clockService.latestRecord();
        const latestBreak = await breakService.getLatestBreak();
        setBreakInfo(await breakService.getBreakInfo());

        if (employeeClockInfo === true) {
            // clocked in already
            setIsClockedIn(true);
            setClockButtonPressed(true);
            setClockButtonText('Stop clock');
        } else {
            // clocked out
            setIsClockedIn(false);
            setClockButtonPressed(false);
            setClockButtonText('Start clock');
        }

        if (latestBreak.in_progress) {
            setIsOnBreak(true);
            setBreakButtonPressed(true);
            setBreakButtonText('End break');
        } else {
            setIsOnBreak(false);
            setBreakButtonText('Start break');
            setBreakButtonPressed(false);
        }
        clockedIn = employeeClockInfo;
        onBreak = latestBreak.in_progress;
    }

    /**
     * useFocusEffect refreshes data every time we return to this screen.
     */
    useFocusEffect(
        React.useCallback(() => {
            async function refreshData() {
                try {
                    await fetchClockData();
                } catch (e) {
                    console.warn(e);
                }
            }
            refreshData().catch((e) => {
                console.warn(e);
            })

        }, [])
    )

    useEffect(() => {
        async function fetchData () {
            try {
                const user = await auth.getUserInfo();
                const totalHours = await timesheetService.getTotalHours();
                const latestProjectData = await projectService.getLatestProject();
                const latestTaskData = await taskService.getLatestTask();
                const geofenceData = await geofenceService.getGeofence(user.username);
                await startLocationTracking();
                await startGeofencing(geofenceData);
                setBreakInfo(await breakService.getBreakInfo());
                setSevenDays(totalHours.totalHoursSeven);
                setThirtyDays(totalHours.totalHoursThirty);
                setWelcomeMessage(`Welcome back, ${user?.username || ''}`);
                setLatestProject(latestProjectData?.name || 'No project assigned.');
                setLatestTask(latestTaskData?.name || 'No task assigned.');

            } catch (error) {
                console.warn(error);
            } finally {
                setAppIsReady(true);
            }
        }

        fetchData().catch((error) => {
            console.warn(error);
        });

        async function getBreakData () {
            const employeeBreakInfo = await breakService.getLatestBreak();
            const timeElapsed = Date.now();
            const today1 = new Date(timeElapsed);
            const today2 = new Date(timeElapsed);
            const found = new Date(employeeBreakInfo.scheduled_stop_time);
            // const minutes = today.getMinutes();
            // today.addMinutes(today, 1);
            const minutes = today1.getMinutes();
            today1.setMinutes(minutes + 1);

            // alert(today.toISOString());
            // alert(found.toISOString());
            // alert(employeeBreakInfo.is_flagged);
            // alert(isOnGrace);
            if (found.getMinutes() < today1.getMinutes() && employeeBreakInfo.is_flagged !== true && isOnGrace === false) {
                alert('grace period has ended');
                setIsOnGrace(true);
                breakService.setFlagInfo();
                // alert(today.toISOString());
                if (employeeBreakInfo.stop_time && employeeBreakInfo.in_progress === false) {
                    setIsOnBreak(false);
                    setBreakButtonPressed(false);
                    setBreakButtonText('Start break');
                    onBreak = false;
                    Alert.alert('Break Duration Exceeded', 'Automatically ending break.');
                }
            } else if (found.getMinutes() < today2.getMinutes() && employeeBreakInfo.is_flagged !== true && isOnGrace === false) {
                alert('grace period is starting');
            }
        }

        const interval = setInterval(() => {
            if(onBreak) {
                getBreakData();
            }
        }, 5000)

        return () => clearInterval(interval);

    }, []);

    /**
     * Updated this function to allow employees to clock in or out even if they are not within the geofence region.
     * Using the inRegion global variable we send a true or false if the employee was within the region when
     * they clock in or out.
     * @returns {Promise<void>}
     */
    const handleClockPress = async () => {
        try {
            if (!inRegion) {
                Alert.alert('Warning', 'You are outside the bounds of the geofence.');
            }

            setLoading(true);

            const location = await getLocation();
            if (location === false) {
                Alert.alert('Request time out.', 'Try again later.');
                return;
            }
            setLatestLocation(location);
            if (isClockedIn === false) {
                const clockInPayload = {
                    geolocation: `${location.coords.latitude}, ${location.coords.longitude}`,
                    in_region: inRegion,
                    is_approved: inRegion,
                };
                await clockService.clockIn(clockInPayload);
                setClockButtonText('Stop clock');
                setClockButtonPressed(true);
                setIsClockedIn(true);
                clockedIn = true;
            } else if (isClockedIn === true) {
                const clockOutPayload = {
                    geolocation: `${location.coords.latitude}, ${location.coords.longitude}`,
                    in_region: inRegion,
                    is_approved: inRegion
                };
                await clockService.clockOut(clockOutPayload);
                setClockButtonText('Start clock');
                setClockButtonPressed(false);
                setIsClockedIn(false);
                clockedIn = false;
            }
        } catch (error) {
            console.error('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBreakPress = async () => {
        try {
            setBreakIsLoading(true);
            if (!isClockedIn) {
                alert('You must be clocked in to go on break.');
                return;
            }

            if(isOnBreak === false) {
                const res = await breakService.startBreak();
                if(res.ok) {
                    Alert.alert('Success', 'Break started')
                    setBreakButtonText('End break');
                    setBreakButtonPressed(true);
                    setIsOnBreak(true);
                    setIsOnGrace(false);
                    onBreak = true;
                } else {
                    const msg = await res.json();
                    Alert.alert('Error', `${msg.message}`);
                }
            }

            if(isOnBreak === true) {
                const res = await breakService.stopBreak();
                if (res.ok) {
                    Alert.alert('Success', `Ended Break`);
                    setBreakButtonText('Start break');
                    setBreakButtonPressed(false);
                    setIsOnBreak(false);
                    onBreak = false;
                }
                else {
                    const msg = await res.json();
                    Alert.alert('Error', `${msg.message}`);
                }
            }
            setBreakInfo(await breakService.getBreakInfo());

        } catch (error) {
            console.error('Error', error.message);
        }
        finally {
            setBreakIsLoading(false);
        }
    };

    if (!appIsReady) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.background, { backgroundColor: '#171A21' }]}>
                <ScrollView>
                    <View style={styles.center}>

                        <Title style={[styles.header, styles.welcomeMessage]}>{welcomeMessage}</Title>

                        <Card style={styles.card}>
                            <View style={styles.horizontal}>
                                <View style={styles.alignLeft}>
                                    <Clock style={styles.clock} format={'h:mm:ss A'} ticking={true} element={Text} />
                                    <CurrentDate style={styles.date} />
                                </View>
                                <View style={styles.center}>
                                    <HighlightButtonClock
                                        style={styles.buttonTest}
                                        text={clockButtonText}
                                        onPress={handleClockPress}
                                        isPressed={clockButtonPressed}
                                        isLoading={isLoading}
                                    />
                                </View>
                            </View>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content style={styles.box}>
                                <Title style={styles.boxHeaders}>{'Timesheets'}</Title>
                                <Paragraph style={styles.boxText}>{`Hours worked this week: ${sevenDays}`}</Paragraph>
                                <Paragraph style={styles.boxText}>{`Hours worked this month: ${thirtyDays}`}</Paragraph>
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content style={styles.box}>
                                <Title style={styles.boxHeaders}>{'Project and Tasks'}</Title>
                                <Paragraph style={styles.boxText}>{`Your Latest Project: ${latestProject}`}</Paragraph>
                                <Paragraph style={styles.boxText}>{`Your latest Task: ${latestTask}`}</Paragraph>
                            </Card.Content>
                        </Card>

                        <Card style={styles.card}>
                            <Card.Content style={styles.box}>
                                <Title style={styles.boxHeaders}>{'Break'}</Title>
                                <Paragraph style={styles.boxText}>{`Break Duration: ${breakInfo ? breakInfo.break_duration : ''} Minutes`}</Paragraph>
                                <Paragraph style={styles.boxText}>{`Breaks Remaining: ${breakInfo ? breakInfo.breaks_remaining : ''}`}</Paragraph>
                            </Card.Content>
                            <Card.Actions style={styles.actions}>
                                <HighlightButton
                                    text={breakButtonText}
                                    onPress={handleBreakPress}
                                    isPressed={breakButtonPressed}
                                    isLoading={breakIsLoading}
                                />
                            </Card.Actions>
                        </Card>

                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: '#2A475E',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBarText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Poppins_600SemiBold'
    },
    card: {
        backgroundColor: '#2A475E',
        width: '95%',
        margin: 5
    },
    box: {
        backgroundColor: '#2A475E',
        padding: 0,
        margin: 5,
        width: '95%' // Adjust as needed
    },
    boxHeaders: {
        fontSize: 18,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    boxTextWelcome: {
        fontSize: 15,
        color: '#C7D5E0'
    },
    date: {
        position: 'absolute',
        top: 5,
        fontFamily: 'Poppins_400Regular',
        fontSize: 20

    },
    time: {
        position: 'absolute',
        top: 50
    },
    welcomeMessage: {
        marginTop: 20
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    alignLeft: {
        alignItems: 'flex-start'
    },
    horizontal: {
        display: 'flex-start',
        flexDirection: 'row',
        padding: 20
    },
    container: {
        flex: 1
    },
    scroll: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    header: {
        fontSize: FontSize.size_5xl,
        lineHeight: 25,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    welcomeMessageNew: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    actions: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5
    },
    actionsClock: {
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 100,
        width: 50,
        height: 50,
        backgroundColor: '#35bd40',
        marginTop: 5
    },
    button: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        marginTop: 5,
        height: 50,
        borderRadius: 100
    },
    buttonTest: {
        backgroundColor: '#35bd40',
        left: 15,
        padding: 10,
        margin: 5,
        borderRadius: 50,
        elevation: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100
    },
    clock: {
        fontSize: 24,
        marginTop: 20,
        color: '#C7D5E0'
    }
});

export default EmployeeDashboard;
