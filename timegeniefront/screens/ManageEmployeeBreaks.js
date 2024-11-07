import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Border, FontSize } from '../assets/GlobalStyles';
import Modal from '../components/Modal';
import EmployeeService from '../services/employee-service';
import BreakService from '../services/break-service';
import EmployeeBreakListComponent from '../components/EmployeeBreakListComponent';
import LoadingScreen from '../components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalEmployees } from '../state/features/employee-slice';
import { Dropdown } from 'react-native-element-dropdown';
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";

const ManageEmployeesBreaks = () => {
    const [fontsLoaded] = loadFonts();
    const dispatch = useDispatch();
    const employeesData = useSelector(state => state.employee.employees);
    const [screenIsReady, setScreenIsReady] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editVisible, setEditVisible] = useState(false);
    const [breaksRemaining, setBreaksRemaining] = useState(null);
    const [breakAmounts, setBreakAmounts] = useState([]);

    useEffect(() => {
        const breakAmounts = Array.from({ length: 6 }, (_, index) => ({
            label: `${index + 1}`,
            value: `${index + 1}`
        }));
        setBreakAmounts(breakAmounts);
        async function fetchData () {
            setScreenIsReady(true);
        }
        fetchData().catch((err) => {
            console.warn(err);
        });
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setScreenIsReady(false);
            async function refreshData() {
                try {
                    EmployeeService.getEmployees()
                        .then((allEmployees) => {
                            dispatch(setGlobalEmployees(allEmployees));
                        });
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

    /**
     * Load in all task data from the selected project
     */
    const refreshEmployees = () => {
        EmployeeService.getEmployees()
            .then((allEmployees) => {
                dispatch(setGlobalEmployees(allEmployees));
            });
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setEditVisible(true);
    };

    const confirmEdit = async () => {
        console.log(selectedEmployee);
        const request = {
            emp_id: selectedEmployee.emp_id,
            breaks_remaining: breaksRemaining,
        };
        const response = await BreakService.editBreaksRemaining(request);
        if (response.ok) {
            closeModal();
            refreshEmployees();
        } else {
            const resBody = await response.json();
            Alert.alert('Error', resBody.message);
            closeModal();
        }
    };

    const closeModal = () => {
        setEditVisible(false);
    };

    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>
            <View style={styles.center}>

                <EmployeeBreakListComponent employeesData={employeesData} onEditEmployee={handleEdit} />

                {/* Edit employees popup */}
                <Modal isVisible={editVisible}>
                    <Modal.Container>
                        <Modal.Header/>
                        <Modal.Body>
                            <View style={styles.modalCenter}>
                                {selectedEmployee && (
                                    <Text style={styles.text}>Editing: {selectedEmployee.first_name}
                                        {selectedEmployee.last_name}</Text>
                                )}
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Edit # of Breaks Remaining'
                                    data={breakAmounts}
                                    labelField='label'
                                    valueField='value'
                                    value={breaksRemaining}
                                    onChange={ item => {
                                        setBreaksRemaining(item.value);
                                    }}
                                />
                            </View>
                        </Modal.Body>

                        <Modal.Footer>
                            <Pressable style={styles.cancel} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmEdit}>
                                <Text style={styles.boxText}>Confirm</Text>
                            </Pressable>
                        </Modal.Footer>
                    </Modal.Container>
                </Modal>
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
        justifyContent: 'center'
    },
    topBarText: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    text: {
        fontSize: 28,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    box: {
        backgroundColor: '#2A475E',
        margin: 10,
        borderRadius: 5,
        width: '95%',
        alignItems: 'center'
    },
    button: {
        padding: 10,
        margin: 15,
        borderRadius: 3,
        backgroundColor: '#35bd40',
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    cancel: {
        padding: 10,
        margin: 15,
        borderRadius: 3,
        backgroundColor: '#d11a2a',
        color: '#C7D5E0'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    boxHeaders: {
        fontSize: 18,
        letterSpacing: 0.25,
        color: '#C7D5E0'
    },
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    modalCenter: {
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
        color: '#C7D5E0'
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        padding: 10,
        fontSize: 16,
        minHeight: 40,
        backgroundColor: '#E2DBD9',
        margin: 6,
        borderRadius: Border.br_7xs
    },
    dropdown: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
        marginTop: '5%'
    },
    placeholderStyle: {
        fontSize: 16,
        fontFamily: 'Poppins_300Light'
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: 'Poppins_300Light'
    },
    iconStyle: {
        width: 20,
        height: 20
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: 'Poppins_300Light'
    },
    icon: {
        marginRight: 5
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
        fontFamily: 'Poppins_300Light'
    },
});
export default ManageEmployeesBreaks;
