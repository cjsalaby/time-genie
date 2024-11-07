import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { FontSize } from '../assets/GlobalStyles.js';
import HighlightButton from '../components/HighlightButton';
import HighlightButtonClock from '../components/HighlightButtonClock';
import CurrentDate from '../components/DateComponent';
import Clock from 'react-live-clock';
import clockService from '../services/clock-service';
import timesheetService from '../services/timesheet-service';
import employeeService from '../services/employee-service';
import { Card, Paragraph, Title } from 'react-native-paper';
import projectService from '../services/project-service';
import taskService from '../services/task-service';
import auth from '../services/auth-service';
import LoadingScreen from '../components/LoadingScreen';
import { getLocation } from '../utils/location-helper';
import { useDispatch } from 'react-redux';
import { setGlobalEmployees } from '../state/features/employee-slice';
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";
import breakService from "../services/break-service";

const ManagerDashboard = () => {
    const [fontsLoaded] = loadFonts();
    const dispatch = useDispatch();
    const [appIsReady, setAppIsReady] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [clockButtonText, setClockButtonText] = useState('loading');
    const [clockButtonPressed, setClockButtonPressed] = useState(false);
    const [sevenDays, setSevenDays] = useState('');
    const [thirtyDays, setThirtyDays] = useState('');
    const [latestProject, setLatestProject] = useState('fetching');
    const [latestTask, setLatestTask] = useState('fetching');
    const [latestEmployeeName, setLatestEmployeeName] = useState('fetching');
    const [latestEmployeeClock, setLatestEmployeeClock] = useState('fetching');
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [breakButtonText, setBreakButtonText] = useState('Start break');
    const [breakButtonPressed, setBreakButtonPressed] = useState(false);
    const [breakIsLoading, setBreakIsLoading] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(null);
    const [breakInfo, setBreakInfo] = useState(null);

    useEffect(() => {
        async function fetchData () {
            try {
                const employeeData = await employeeService.getEmployees();
                dispatch(setGlobalEmployees(employeeData));
                const user = await auth.getUserInfo();
                const totalHours = await timesheetService.getTotalHours();
                const latestProjectData = await projectService.getLatestProject();
                const latestTaskData = await taskService.getLatestTask();
                const latestEmployeeData = await employeeService.getLatestEmployee();
                setSevenDays(totalHours.totalHoursSeven);
                setThirtyDays(totalHours.totalHoursThirty);
                setWelcomeMessage(`Welcome back, ${user?.username || ''}`);
                setLatestProject(latestProjectData?.name || 'No project assigned.');
                setLatestTask(latestTaskData?.name || 'No task assigned.');
                setLatestEmployeeName(latestEmployeeData?.employee || 'No employees.');
                setLatestEmployeeClock(latestEmployeeData?.clock_in || 'fetching');
                setBreakInfo(await breakService.getBreakInfo());

                const employeeClockInfo = await clockService.latestRecord();
                console.log('this emp clocked in? ', employeeClockInfo);
                if (employeeClockInfo === true) {
                    setIsClockedIn(true);
                    setClockButtonPressed(true);
                    setClockButtonText('Stop clock');
                } else {
                    setClockButtonText('Start clock');
                }
            } catch (error) {
                console.warn(error);
            } finally {
                setAppIsReady(true);
            }
        }
        fetchData().catch((error) => {
            console.warn(error);
        });
    }, [dispatch]);

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

    const handleClockPress = async () => {
        try {
            const location = await getLocation();
            if (location === false) {
                Alert.alert('Request time out.', 'Try again later.');
                return;
            }
            setLoading(true);
            if (isClockedIn === false) {
                const clockInPayload = {
                    geolocation: `${location.coords.latitude}, ${location.coords.longitude}`,
                    in_region: true,
                    is_approved: true,
                };
                await clockService.clockIn(clockInPayload);
                setClockButtonText('Stop clock');
                setClockButtonPressed(true);
                setIsClockedIn(true);
            } else if (isClockedIn === true) {
                const clockOutPayload = {
                    geolocation: `${location.coords.latitude}, ${location.coords.longitude}`,
                    in_region: true,
                };
                await clockService.clockOut(clockOutPayload);
                setClockButtonText('Start clock');
                setClockButtonPressed(false);
                setIsClockedIn(false);
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
            <View style={[styles.background, { backgroundColor: '#171A21', flex: 1 }]}>
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
                                <Title style={styles.boxHeaders}>{'Latest Employee Clock In'}</Title>
                                <Paragraph style={styles.boxText}>{`${latestEmployeeName}`}</Paragraph>
                                <Paragraph style={styles.boxText}>{`${latestEmployeeClock}`}</Paragraph>
                            </Card.Content>
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
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBarText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Poppins_900Black',
    },
    card: {
        backgroundColor: '#2A475E',
        width: '95%',
        margin: 5
    },
    box: {
        backgroundColor: '#2A475E',
        padding: 15,
        margin: 5,
        width: '95%' // Adjust as needed
    },
    boxHeaders: {
        fontSize: 18,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    actions: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 3,
        backgroundColor: '#35bd40'
    },
    date: {
        position: 'absolute',
        top: 5
    },
    time: {
        position: 'absolute',
        top: 50
    },
    welcomeMessage: {
        marginTop: 20
    },
    welcomeMessageNew: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
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
        color: '#C7D5E0'
    },
    clock: {
        fontSize: 24,
        color: '#C7D5E0'
    }
});

export default ManagerDashboard;
