import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Border, FontSize } from '../assets/GlobalStyles';
import Modal from '../components/Modal';
import EmployeeService from '../services/employee-service';
import EmployeeListComponent from '../components/EmployeeListComponent';
import LoadingScreen from '../components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalEmployees } from '../state/features/employee-slice';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import {loadFonts} from "../assets/fonts-helper";

const ManageEmployeesPage = () => {
    const [fontsLoaded] = loadFonts();
    const dispatch = useDispatch();
    const employeesData = useSelector(state => state.employee.employees);
    const [screenIsReady, setScreenIsReady] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [empType, setEmpType] = useState('');
    const [maxBreaks, setMaxBreaks] = useState(null);
    const [breakDuration, setBreakDuration] = useState(null);
    const [breakAmounts, setBreakAmounts] = useState([]);
    const [breakMinutes, setBreakMinutes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const breakAmounts = Array.from({ length: 10 }, (_, index) => ({
            label: `${index + 1}`,
            value: `${index + 1}`
        }));
        const breakMinutes = Array.from({ length: 60 }, (_, index) => ({
            label: `${index + 1}`,
            value: `${index + 1}`
        }));
        setBreakAmounts(breakAmounts);
        setBreakMinutes(breakMinutes);
        async function fetchData () {
            setScreenIsReady(true);
        }
        fetchData().catch((err) => {
            console.warn(err);
        });
    }, []);

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

    const handleCreate = () => {
        setCreateVisible(true);
    };

    const confirmCreate = async () => {
        if (!firstName || !lastName || !username || !password || !empType || roles.length < 1) {
            setError('All fields must be filled.');
            closeModal();
            return;
        }
        const request = {
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password,
            roles,
            employment_type: empType
        };
        const response = await EmployeeService.createEmployee(request);
        if (response.ok) {
            console.log(await response.json());
            closeModal();
            resetFields();
            refreshEmployees();
        } else {
            closeModal();
            resetFields();
            const resBody = await response.json();
            setError(resBody.message);
        }
    };

    const resetFields = () => {
        setFirstName('');
        setLastname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setEmpType('');
        setRoles([]);
        setError(null);
    };
    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setRoles(employee.roles);
        setEditVisible(true);
    };

    const confirmEdit = async () => {
        if (!empType && roles.length < 1) {
            setError('You must select an employment type or role(s)');
            closeModal();
            return;
        }
        const request = {
            username: selectedEmployee.username,
            email: email || selectedEmployee.email,
            roles: roles || selectedEmployee.roles,
            employment_type: empType || selectedEmployee.employment_type,
            max_breaks: maxBreaks || selectedEmployee.max_breaks,
            break_duration: breakDuration || selectedEmployee.break_duration
        };
        console.log(request);
        const response = await EmployeeService.updateEmployee(request);
        if (response.ok) {
            setEmail('');
            setEmpType('');
            setRoles([]);
            setError(null);
            closeModal();
            refreshEmployees();
        } else {
            const resBody = await response.json();
            setError(resBody.message);
            closeModal();
        }
    };

    const handleDelete = () => {
        setDeleteVisible(true);
    };

    const closeModal = () => {
        setCreateVisible(false);
        setEditVisible(false);
        setDeleteVisible(false);
        setEmpType(null);
        setRoles([]);
    };

    const confirmDelete = () => {
        closeModal();
    };

    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>
            <View style={styles.center}>
                <View style={styles.box}>
                    <Text style={styles.boxHeaders}>{'Manage Employees'}</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={handleCreate}>
                            <Text style={{ color: '#ffffff', fontSize: 16 }}>Create</Text>
                        </Pressable>
                    </View>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>

                <EmployeeListComponent employeesData={employeesData} onEditEmployee={handleEdit} />

                <Modal isVisible={createVisible}>
                    <Modal.Container>
                        <Modal.Header/>
                        <Modal.Body>
                            <View style={styles.modalCenter}>
                                <TextInput
                                    label="First Name"
                                    value={firstName}
                                    style={styles.input}
                                    placeholder="First Name"
                                    onChangeText={setFirstName}
                                />
                                <TextInput
                                    label="Last Name"
                                    value={lastName}
                                    style={styles.input}
                                    placeholder="Last Name"
                                    onChangeText={setLastname}
                                />
                                <TextInput
                                    label="Username"
                                    value={username}
                                    style={styles.input}
                                    placeholder="Username"
                                    onChangeText={setUsername}
                                />
                                <TextInput
                                    label="Email"
                                    value={email}
                                    style={styles.input}
                                    placeholder="Email"
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    label="Password"
                                    value={password}
                                    style={styles.input}
                                    placeholder="Password"
                                    onChangeText={setPassword}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Select Employment'
                                    data={[
                                        { label: 'Full-Time', value: 'FULLTIME' },
                                        { label: 'Part-Time', value: 'PARTTIME' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={empType}
                                    onChange={ item => {
                                        setEmpType(item.value);
                                    }}
                                />
                                <MultiSelect
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Select Role(s)'
                                    data={[
                                        { label: 'Office', value: 'OFFICE' },
                                        { label: 'Remote', value: 'REMOTE' },
                                        { label: 'Field', value: 'FIELD' },
                                        { label: 'Repair', value: 'REPAIR' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={roles}

                                    onChange={ item => {
                                        setRoles(item);
                                    }}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.icon}
                                            color="black"
                                            name="Safety"
                                            size={20}
                                        />
                                    )}
                                    renderSelectedItem={(item, unSelect) => (
                                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                            <View style={styles.selectedStyle}>
                                                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                                <AntDesign color="black" name="delete" size={17} />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </Modal.Body>

                        <Modal.Footer>
                            <Pressable style={styles.cancel} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmCreate}>
                                <Text style={styles.boxText}>Confirm</Text>
                            </Pressable>
                        </Modal.Footer>
                    </Modal.Container>
                </Modal>

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
                                <TextInput
                                    label="Email"
                                    value={email}
                                    style={styles.input}
                                    placeholder="Email"
                                    onChangeText={setEmail}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Select Employment'
                                    data={[
                                        { label: 'Full-Time', value: 'FULLTIME' },
                                        { label: 'Part-Time', value: 'PARTTIME' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={empType}
                                    onChange={ item => {
                                        setEmpType(item.value);
                                    }}
                                />
                                <MultiSelect
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Select Role(s)'
                                    data={[
                                        { label: 'Office', value: 'OFFICE' },
                                        { label: 'Remote', value: 'REMOTE' },
                                        { label: 'Field', value: 'FIELD' },
                                        { label: 'Repair', value: 'REPAIR' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={roles}

                                    onChange={ item => {
                                        setRoles(item);
                                    }}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.icon}
                                            color="black"
                                            name="Safety"
                                            size={20}
                                        />
                                    )}
                                    renderSelectedItem={(item, unSelect) => (
                                        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                            <View style={styles.selectedStyle}>
                                                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                                <AntDesign color="black" name="delete" size={17} />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Edit Maximum # of Breaks'
                                    data={breakAmounts}
                                    labelField='label'
                                    valueField='value'
                                    value={maxBreaks}
                                    onChange={ item => {
                                        setMaxBreaks(item.value);
                                    }}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Edit Break Duration'
                                    data={breakMinutes}
                                    labelField='label'
                                    valueField='value'
                                    value={breakDuration}
                                    onChange={ item => {
                                        setBreakDuration(item.value);
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

                <Modal isVisible={deleteVisible}>
                    <Modal.Container>
                        <Modal.Header/>

                        <Modal.Body>
                            <View style={styles.modalCenter}>
                                <TextInput
                                    label="Last Name"
                                    style={styles.input}
                                    placeholder="Last Name"
                                    onChangeText={setLastname}
                                />
                                <TextInput
                                    label="Username"
                                    style={styles.input}
                                    placeholder="Username"
                                    onChangeText={setUsername}
                                />
                            </View>
                        </Modal.Body>

                        <Modal.Footer>
                            <Pressable style={styles.button} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmDelete}>
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
    errorBox: {
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center'
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
    errorText: {
        color: '#ff0000',
        fontFamily: 'Poppins_300Light'
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
        backgroundColor: '#FFFFFF',
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
    }
});
export default ManageEmployeesPage;
