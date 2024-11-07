import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import EmployeeService from '../services/employee-service';
import ExportService from '../services/export-service';
import { Dropdown } from 'react-native-element-dropdown';
import {Checkbox} from "expo-checkbox";
import {loadFonts} from "../assets/fonts-helper";
import LoadingScreen from "../components/LoadingScreen";

/**
 * Screen for exporting CSV data to mobile device.
 *
 * @returns {Element}
 * @constructor
 */
const ManagerExportTimesheets = () => {
    const [fontsLoaded] = loadFonts();
    const [loadingTimesheet, setLoadingTimesheet] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [days, setDays] = useState('');
    const [items, setItems] = useState([]);
    const [format, setFormat] = useState('');
    const [formats] = useState([
        { label: 'PDF', value: 'PDF' },
        { label: 'CSV', value: 'CSV' }
    ]);
    const [isChecked, setChecked] = useState(false);

    async function fetchData () {
        EmployeeService.getEmployees().then((empData) => {
            const allEmployees = {
                first_name: 'All employees',
                username: 'all'
            };
            empData.unshift(allEmployees);
            setEmployeeData(empData);
            console.log('fetching all employee data.');
        });
    }

    useEffect(() => {
        const items = Array.from({ length: 30 }, (_, index) => ({
            label: `${index + 1}`,
            value: `${index + 1}`
        }));
        setItems(items);
        fetchData().catch((error) => {
            console.warn(error);
        });
    }, []);

    const handleExportPress = async () => {
        if (selectedEmployee === null) {
            Alert.alert('Error:', 'You must select an employee or all employees.');
            return;
        }
        if (days === '') {
            Alert.alert('Error:', 'You must select days ago.');
            return;
        }
        if (format === '') {
            Alert.alert('Error:', 'You must select a file format.');
            return;
        }
        let success = false;
        if (selectedEmployee !== 'all') {
            try {
                setLoadingTimesheet(true);
                success = await ExportService.downloadEmployeeData(selectedEmployee, days, format, isChecked)
            } finally {
                setLoadingTimesheet(false);
            }
            if (success === true) {
                if(!isChecked) {
                    Alert.alert('Success', 'Successfully generated export file for employee.');
                }
            } else {
                Alert.alert('Error', 'An error occurred.');
            }
        } else if (selectedEmployee === 'all') {
            try {
                setLoadingTimesheet(true);
                success = await ExportService.downloadData(days, format, isChecked);
            } finally {
                setLoadingTimesheet(false);
            }
            if (success === true) {
                if (!isChecked) {
                    Alert.alert('Success', 'Successfully generated export file for all employees.');
                }
            } else {
                Alert.alert('Error', 'An error occurred.');
            }
        }
        setSelectedEmployee(null);
        setDays(null);
    };

    if (loadingTimesheet) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        placeholder='Select Employee'
                        search
                        searchPlaceholder="Search..."
                        data={employeeData}
                        labelField='first_name'
                        valueField='username'
                        onChange={ item => {
                            setSelectedEmployee(item.username);
                        }}
                        onFocus={() => {
                            fetchData();
                        }}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        placeholder='Days ago'
                        data={items}
                        labelField='label'
                        valueField='value'
                        value={days}
                        onChange={ item => {
                            setDays(item.value);
                        }}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        placeholder='Select file format'
                        data={formats}
                        labelField='label'
                        valueField='value'
                        value={format}
                        onChange={ item => {
                            setFormat(item.value);
                        }}
                    />
                    {Platform.OS === 'android' ?
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                value={isChecked}
                                onValueChange={setChecked}
                            />
                            <Text style={styles.text}>Send to Email?</Text>
                        </View>
                        : null}
                </Card.Content>
                <Card.Content style={styles.actions}>
                    <TouchableOpacity style={styles.button} onPress={handleExportPress} >
                        <Text style={styles.text}>EXPORT TIMESHEET</Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171A21',
        alignItems: 'center'
    },
    text: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        marginVertical: 2,
        fontFamily: 'Poppins_300Light'
    },
    button: {
        padding: 8,
        borderRadius: 2,
        alignItems: 'center',
        backgroundColor: '#35bd40',
        width: '100%',
        marginTop: '5%',
        fontFamily: 'Poppins_300Light'
    },
    card: {
        backgroundColor: '#2A475E',
        width: '95%',
        margin: 20
    },
    header: {
        alignItems: 'center'
    },
    content: {
        flexDirection: 'column',
        gap: 20
    },
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        backgroundColor: 'white',
        textAlign: 'center',
        fontFamily: 'Poppins_300Light'
    },
    actions: {
        marginTop: '5%',
        width: '100%'
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
    checkboxContainer: {
        alignItems: 'center',

    },
    checkbox: {
        margin: 8,
    },
});

export default ManagerExportTimesheets;
