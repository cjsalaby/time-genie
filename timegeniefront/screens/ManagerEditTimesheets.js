import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import TimesheetService from '../services/timesheet-service';
import EditableTimesheetComponent from '../components/EditableTimesheetComponent';
import Modal from '../components/Modal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import {loadFonts} from "../assets/fonts-helper";
import ProjectService from "../services/project-service";
import {useFocusEffect} from "@react-navigation/native";
const ManagerEditTimesheets = () => {
    const [fontsLoaded] = loadFonts();
    const allEmployeesData = useSelector(state => state.employee.employees);
    const [newClockInDate, setNewClockInDate] = useState(new Date());
    const [newClockInTime, setNewClockInTime] = useState(new Date());
    const [newClockOutDate, setNewClockOutDate] = useState(new Date());
    const [newClockOutTime, setNewClockOutTime] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [allTimesheetData, setTimesheetData] = useState([]);
    const [selectedClockData, setSelectedClockData] = useState(null);
    const [isEditVisible, setEditVisible] = useState(false);
    const [isClockInDatePickerVisible, setClockInDatePickerVisibility] = useState(false);
    const [isClockInTimePickerVisible, setClockInTimePickerVisibility] = useState(false);
    const [isClockOutDatePickerVisible, setClockOutDatePickerVisibility] = useState(false);
    const [isClockOutTimePickerVisible, setClockOutTimePickerVisibility] = useState(false);
    const [editStep, setEditStep] = useState('none');
    const [employeesData, setEmployeesData] = useState([]);

    function getEmployeesData() {
        setEmployeesData(allEmployeesData);
    }

    useEffect(() => {
        getEmployeesData();
    }, []);

    const getSelectedEmployeeTimesheets = (selectedEmployee) => {
        if (!selectedEmployee) {
            return;
        }
        TimesheetService.getEmployeeTimesheets(selectedEmployee).then((allTimesheetData) => {
            setTimesheetData(allTimesheetData);
        });
    };

    const handlePressEdit = (clockData) => {
        console.log(clockData.clock_in_time);
        setSelectedClockData(clockData);
        setEditVisible(true);
    };

    //= =============================================
    const handleEditClockInDate = () => {
        setClockInDatePickerVisibility(true);
        setClockInTimePickerVisibility(false);
        setClockOutDatePickerVisibility(false);
        setClockOutTimePickerVisibility(false);
    };

    const handleEditClockInTime = () => {
        setClockInTimePickerVisibility(true);
        setClockInDatePickerVisibility(false);
        setClockOutDatePickerVisibility(false);
        setClockOutTimePickerVisibility(false);
    };

    const onClockInDateChange = (e, selectedDate) => {
        if (Platform.OS === 'android') {
            console.log('THIS IS AN ANDROID.');
            setClockInDatePickerVisibility(false);
            setClockInTimePickerVisibility(false);
        }
        if (e.type === 'set') {
            setNewClockInDate(selectedDate);
        }
    };

    const onClockInTimeChange = (e, selectedTime) => {
        if (Platform.OS === 'android') {
            setClockInDatePickerVisibility(false);
            setClockInTimePickerVisibility(false);
        }
        if (e.type === 'set') {
            setNewClockInTime(selectedTime);
        }
    };

    //= ==================================================
    const handleEditClockOutDate = () => {
        setClockOutDatePickerVisibility(true);
        setClockOutTimePickerVisibility(false);
        setClockInDatePickerVisibility(false);
        setClockInTimePickerVisibility(false);
    };

    const handleEditClockOutTime = () => {
        setClockOutTimePickerVisibility(true);
        setClockOutDatePickerVisibility(false);
        setClockInDatePickerVisibility(false);
        setClockInTimePickerVisibility(false);
    };

    const onClockOutDateChange = (e, selectedDate) => {
        if (Platform.OS === 'android') {
            setClockOutDatePickerVisibility(false);
            setClockOutTimePickerVisibility(false);
        }
        if (e.type === 'set') {
            setNewClockOutDate(selectedDate);
        }
    };

    const onClockOutTimeChange = (e, selectedTime) => {
        if (Platform.OS === 'android') {
            setClockOutDatePickerVisibility(false);
            setClockOutTimePickerVisibility(false);
        }
        if (e.type === 'set') {
            setNewClockOutTime(selectedTime);
        }
    };

    //= ============================================================

    const onConfirm = async () => {
        const clockInDate = newClockInDate.getFullYear() + '-' +
            String(newClockInDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(newClockInDate.getDate()).padStart(2, '0');

        const clockOutDate = newClockOutDate.getFullYear() + '-' +
            String(newClockOutDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(newClockOutDate.getDate()).padStart(2, '0');

        const to24Hr = { hour: 'numeric', minute: 'numeric', hour12: false };
        const clockInTime = newClockInTime.toLocaleTimeString('en-US', to24Hr);
        const clockOutTime = newClockOutTime.toLocaleTimeString('en-US', to24Hr);

        const clockIn = clockInDate + ' ' + clockInTime;
        const clockOut = clockOutDate + ' ' + clockOutTime;

        if (clockOut < clockIn) {
            Alert.alert('Error', 'Clock out date and time cannot be less than the clock in date and time.', [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ]);
            return closeModal();
        }
        if (clockOut === clockIn) {
            Alert.alert('Error', 'Clock out and clock in cannot be the same.', [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ]);
            return closeModal();
        }

        const request = {
            username: selectedEmployee,
            timesheet_id: selectedClockData.timesheet_id,
            clock_in: clockIn,
            clock_out: clockOut
        };

        await TimesheetService.editEmployeeTimesheets(request);
        closeModal();
        getSelectedEmployeeTimesheets();
    };

    const handleApproveTimesheet = async (clockData) => {
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
                            username: selectedEmployee,
                            timesheet_id: clockData.timesheet_id,
                            is_approved: true
                        };

                        await TimesheetService.editEmployeeTimesheets(request);
                        getSelectedEmployeeTimesheets(selectedEmployee);
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const handleDisapproveTimesheet = async (clockData) => {
        Alert.alert(
            'Confirm Disapproval',
            'Are you sure you want to disapprove this timesheet?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        const request = {
                            username: selectedEmployee,
                            timesheet_id: clockData.timesheet_id,
                            is_approved: false
                        }

                        await TimesheetService.editEmployeeTimesheets(request);
                        getSelectedEmployeeTimesheets(selectedEmployee);
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const closeModal = () => {
        setEditVisible(false);
        setClockInDatePickerVisibility(false);
        setClockInTimePickerVisibility(false);
        setClockOutDatePickerVisibility(false);
        setClockOutTimePickerVisibility(false);
        setEditStep('none');
        setNewClockInDate(new Date());
        setNewClockOutDate(new Date());
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    placeholder='Select Employee'
                    search
                    searchPlaceholder="Search..."
                    data={employeesData}
                    labelField='first_name'
                    valueField='username'
                    value={selectedEmployee}
                    onChange={ item => {
                        setSelectedEmployee(item.username);
                        getSelectedEmployeeTimesheets(item.username);
                    }}
                    onFocus={() =>{
                        getEmployeesData();
                    }}
                />
            </View>

            <EditableTimesheetComponent
                timesheetData={allTimesheetData}
                onEdit={handlePressEdit}
                onApprove={handleApproveTimesheet}
                onDisapprove={handleDisapproveTimesheet}
            />

            <Modal isVisible={isEditVisible}>
                <Modal.Container>
                    <Modal.Body>
                        <Text style={styles.boxText}>Clock In Date: {newClockInDate.toLocaleDateString()}</Text>
                        <Text style={styles.boxText}>Clock In Time: {newClockInTime.toLocaleTimeString()}</Text>
                        <Text style={styles.boxText}>Clock Out Date: {newClockOutDate.toLocaleDateString()}</Text>
                        <Text style={styles.boxText}>Clock Out Time: {newClockOutTime.toLocaleTimeString()}</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Pressable style={styles.button} onPress={handleEditClockInDate}>
                            <Text style={styles.boxText}>Clock In Date</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={handleEditClockInTime}>
                            <Text style={styles.boxText}>Clock In Time</Text>
                        </Pressable>
                    </Modal.Footer>
                    <Modal.Footer>
                        <Pressable style={styles.button} onPress={handleEditClockOutDate}>
                            <Text style={styles.boxText}>Clock Out Date</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={handleEditClockOutTime}>
                            <Text style={styles.boxText}>Clock Out Time</Text>
                        </Pressable>
                    </Modal.Footer>
                    <Modal.Footer>
                        <Pressable style={styles.cancel} onPress={closeModal}>
                            <Text style={styles.boxText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={onConfirm}>
                            <Text style={styles.boxText}>Confirm</Text>
                        </Pressable>
                    </Modal.Footer>
                    <View style={{ backgroundColor: '#FAF9F6' }}>
                        {isClockInDatePickerVisible && (
                            <RNDateTimePicker
                                value={date}
                                mode="date"
                                display="spinner"
                                onChange={onClockInDateChange}
                            />
                        )}
                        {isClockInTimePickerVisible && (
                            <RNDateTimePicker
                                value={date}
                                mode="time"
                                display="spinner"
                                onChange={onClockInTimeChange}
                            />
                        )}

                        {isClockOutDatePickerVisible && (
                            <RNDateTimePicker
                                value={date}
                                mode="date"
                                display="spinner"
                                onChange={onClockOutDateChange}
                            />
                        )}

                        {isClockOutTimePickerVisible && (
                            <RNDateTimePicker
                                value={date}
                                mode="time"
                                display="spinner"
                                onChange={onClockOutTimeChange}
                            />
                        )}
                    </View>
                </Modal.Container>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171A21',
        alignItems: 'center'
    },
    topBar: {
        width: '100%'
    },
    card: {
        backgroundColor: '#2A475E',
        width: '95%',
        margin: 5
    },
    content: {
        backgroundColor: '#2A475E',
        padding: 15,
        margin: 5,
        width: '95%' // Adjust as needed
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
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 2,
        backgroundColor: '#35bd40',
        color: '#C7D5E0'
    },
    cancel: {
        padding: 10,
        margin: 5,
        borderRadius: 2,
        backgroundColor: '#d11a2a',
        color: '#C7D5E0'
    }

});

export default ManagerEditTimesheets;
