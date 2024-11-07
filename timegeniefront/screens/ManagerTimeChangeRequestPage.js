import {Alert, Pressable, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import timeChangeService from "../services/timechange-request-service";
import auth from "../services/auth-service";
import LoadingScreen from "../components/LoadingScreen";
import {Card} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import TimesheetService from "../services/timesheet-service";
import {useFocusEffect} from "@react-navigation/native";

const ManagerTimeChangeRequestPage = () => {
    const [timeChangeRequests, setTimeChangeRequests] = useState([]);
    const [screenIsReady, setScreenIsReady] = useState(false);
    useEffect(() => {
        async function fetchData () {
            try {
                const timeChangeRequests = await timeChangeService.getManagerEmployeeTimeChangeRequests();
                setTimeChangeRequests(timeChangeRequests);
            } catch (err) {
                console.warn(err);
                throw err;
            } finally {
                setScreenIsReady(true);
            }
        }

        fetchData().catch((error) => {
            console.warn(error);
        });
    }, []);

    /**
     * useFocusEffect refreshes data every time we return to this screen.
     */
    useFocusEffect(
        React.useCallback(() => {
            async function refreshData() {
                setScreenIsReady(false);
                try {
                    await refreshTimeChangeRequests();
                } catch (e) {
                    console.warn(e);
                } finally {
                    setScreenIsReady(true);
                }
            }
            refreshData().catch((e) => {
                console.warn(e);
            })

        }, [])
    );

    const refreshTimeChangeRequests = async () => {
        try {
            const timeChangeRequests = await timeChangeService.getManagerEmployeeTimeChangeRequests();
            setTimeChangeRequests(timeChangeRequests);
        } catch (err) {
            console.warn(err);
            throw err;
        }
    }

    const handleApproveTimeChange = async (data) => {
        Alert.alert(
            'Confirm Approval',
            'Are you sure you want to approve this timesheet?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        const request = {
                            id: data.id,
                            approval: true
                        };

                        await timeChangeService.editTimeChangeRequestApproval(request);
                        await refreshTimeChangeRequests();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const handleDenyTimeChange = async (data) => {
        Alert.alert(
            'Confirm Denial',
            'Are you sure you want to deny this time change?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        const request = {
                            id: data.id,
                            approval: false
                        };

                        await timeChangeService.editTimeChangeRequestApproval(request);
                        await refreshTimeChangeRequests();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    if (!screenIsReady) {
        return <LoadingScreen />;
    }
    if (timeChangeRequests === null) {
        return (
            <View style={{ backgroundColor: '#171A21', flex: 1 }}/>
        );
    }
    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>
            <ScrollView>
                {timeChangeRequests.map((data, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content style={styles.box}>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`Username: `}</Text>
                                <Text style={styles.text}>{data.username}</Text>
                            </View>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`Timesheet #: `}</Text>
                                <Text style={styles.text}>{data.timesheet_id}</Text>
                            </View>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`Approved? `}</Text>
                                <Text style={styles.text}>{data.is_approved === null ? 'Waiting for Approval' : String(data.is_approved)}</Text>
                            </View>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`Request Description: `}</Text>
                            </View>
                            <View>
                                <Text style={styles.text}>{data.description}</Text>
                            </View>
                        </Card.Content>
                        <Card.Actions style={styles.iconBox}>
                            {data.is_approved === false || data.is_approved === null ? (
                                <Pressable onPress={() => handleApproveTimeChange(data)}>
                                    <Icon name="check" size={20} color="#35bd40" style={styles.icon} />
                                </Pressable>
                            ) : (
                                <Pressable onPress={() => handleDenyTimeChange(data)}>
                                    <Icon name="close" size={20} color="#ff0000" style={styles.icon} />
                                </Pressable>
                            )}
                        </Card.Actions>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = {
    scrollView: {
        height: '100%'
    },
    cell: {
        backgroundColor: '#2A475E',
        borderWidth: 1,
        borderColor: '#C7D5E0',
        padding: 10,
        marginVertical: 5
    },
    text: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light',
        flexShrink: 1
    },
    lead_text: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontWeight: 'bold',
        padding: 1,
        fontFamily: 'Poppins_600SemiBold'
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
    iconBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    text_box: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    }
};

export default ManagerTimeChangeRequestPage;
