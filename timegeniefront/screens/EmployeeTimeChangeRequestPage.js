import {Pressable, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import timeChangeService from "../services/timechange-request-service";
import auth from "../services/auth-service";
import LoadingScreen from "../components/LoadingScreen";
import {Card} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import {useFocusEffect} from "@react-navigation/native";

const EmployeeTimeChangeRequestPage = () => {
    const [timeChangeRequests, setTimeChangeRequests] = useState([]);
    const [screenIsReady, setScreenIsReady] = useState(false);
    useEffect(() => {
        async function fetchData () {
            try {
                const timeChangeRequests = await timeChangeService.getEmployeeTimeChangeRequests();
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
            setScreenIsReady(false);
            async function refreshData() {
                try {
                    const timeChangeRequests = await timeChangeService.getEmployeeTimeChangeRequests();
                    setTimeChangeRequests(timeChangeRequests);
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

    if (!screenIsReady) {
        return <LoadingScreen />;
    }
    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>
            <ScrollView>
                {timeChangeRequests.map((data, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content style={styles.box}>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`ID: `}</Text>
                                <Text style={styles.text}>{data.id}</Text>
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

export default EmployeeTimeChangeRequestPage;
