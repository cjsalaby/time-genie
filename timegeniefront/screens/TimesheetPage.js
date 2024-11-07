import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Pressable, TextInput, Alert, TouchableOpacity} from 'react-native';
import timesheetService from '../services/timesheet-service';
import {Border, FontSize} from '../assets/GlobalStyles';
import TimesheetComponent from '../components/TimesheetComponent';
import { Card } from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen';
import {loadFonts} from "../assets/fonts-helper";
import auth from "../services/auth-service";
import Modal from "../components/Modal";
import { formatDate } from "../utils/date-location-helper";
import timeChangeService from "../services/timechange-request-service";
import {useFocusEffect} from "@react-navigation/native";

const TimesheetPage = () => {
    const [fontsLoaded] = loadFonts();
    const [screenIsReady, setScreenIsReady] = useState(false);
    const [timesheetData, setTimesheetData] = useState([]);
    const [sevenDays, setSevenDays] = useState('');
    const [thirtyDays, setThirtyDays] = useState('');
    const [user, setUser] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [isEditVisible, setEditVisible] = useState(false);
    const [description, setDescription] = useState('');

    async function fetchData () {
        try {
            setScreenIsReady(false);
            const timesheetData = await timesheetService.getTimesheets();
            const totalHours = await timesheetService.getTotalHours();
            const user = await auth.getUserInfo();
            setUser(user);
            setSevenDays(totalHours.totalHoursSeven);
            setThirtyDays(totalHours.totalHoursThirty);
            setTimesheetData(timesheetData);
        } catch (err) {
            console.warn(err);
        } finally {
            setScreenIsReady(true);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData().catch((e) => {
                console.warn(e);
            })
        }, [])
    )

    if (!screenIsReady) {
        return <LoadingScreen />;
    }

    const editTimeSheetEmployee = (selectedData) => {
        setDescription(null);
        setSelectedData(selectedData);
        setEditVisible(true);
    };

    const onConfirm = async () => {
        if (!description || description === '') {
            Alert.alert('Error', 'Description cannot be empty');
            return;
        }
        const request = {
            timesheet_id: selectedData.timesheet_id,
            description: description
        }
        const res = await timeChangeService.createTimeChangeRequest(request);
        if (res.ok) {
            Alert.alert('Success', `Created time change request for #${selectedData.timesheet_id}`);

        } else {
            const msg = await res.json();
            Alert.alert('Error', `${msg.message}`);
        }
        closeModal();
    }

    const closeModal = () => {
        setEditVisible(false);
    }

    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>

            <Card style={styles.card}>
                <Card.Content style={styles.box}>
                    <Text style={styles.boxHeaders}>{'Total hours'}</Text>
                    <Text style={styles.boxText}>{`Hours worked this week: ${sevenDays}`}</Text>
                    <Text style={styles.boxText}>{`Hours worked this week: ${thirtyDays}`}</Text>
                </Card.Content>
            </Card>

            <TimesheetComponent
                timesheetData={timesheetData}
                onEditTimeSheet={user.roles.includes('MANAGER') ?
                    null : editTimeSheetEmployee}
            />

            <Modal isVisible={isEditVisible}>
                <Modal.Container>
                    <Modal.Header title={'Time Change Request'}/>
                    <Modal.Body >
                        <View style={{marginTop: 20}}>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`Clock In: `}</Text>
                                {selectedData === null ? null :
                                    <Text style={styles.text}>{selectedData.clock_in_time ?
                                        formatDate(selectedData.clock_in_time) : null}</Text>
                                }

                            </View>
                            <View style={styles.text_box}>
                                <Text style={styles.lead_text}>{`Clock Out: `}</Text>
                                {selectedData === null ? null :
                                    <Text style={styles.text}>{selectedData.clock_out_time ?
                                        formatDate(selectedData.clock_out_time) : null}</Text>
                                }
                            </View>
                        </View>
                        <TextInput
                            label="Description of Request"
                            style={styles.input}
                            placeholder="Description of Request"
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            multiline={true}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity style={styles.cancel} onPress={closeModal}>
                            <Text style={styles.boxText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onConfirm}>
                            <Text style={styles.boxText}>Confirm</Text>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Container>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: '#2A475E',
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBarText: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light',
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
        fontFamily: 'Poppins_300Light',
    },
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light',
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
    header: {
        fontSize: FontSize.size_5xl,
        lineHeight: 25,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#C7D5E0',
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        padding: 10,
        fontSize: 16,
        minHeight: 100,
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        borderRadius: Border.br_7xs
    },
    button: {
        padding: 10,
        margin: 15,
        borderRadius: 3,
        backgroundColor: '#35bd40',
        color: '#C7D5E0'
    },
    cancel: {
        padding: 10,
        margin: 15,
        borderRadius: 3,
        backgroundColor: '#d11a2a',
        color: '#C7D5E0'
    },
    text: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    lead_text: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontWeight: 'bold',
        padding: 1,
        fontFamily: 'Poppins_600SemiBold'
    },
    text_box: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    }
});

export default TimesheetPage;
