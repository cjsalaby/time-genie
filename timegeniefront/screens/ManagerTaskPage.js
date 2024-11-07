import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Border } from '../assets/GlobalStyles';
import Modal from '../components/Modal';
import React, { useEffect, useState } from 'react';
import taskService from '../services/task-service';
import ManagerTaskListComponent from '../components/ManagerTaskListComponent';
import { Dropdown } from 'react-native-element-dropdown';
import timeTrackingService from '../services/timetracking-service';
import { useSelector } from 'react-redux';
import {loadFonts} from "../assets/fonts-helper";
import ProjectService from "../services/project-service";
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from '../components/LoadingScreen';


const ManagerTaskPage = () => {
    const [fontsLoaded] = loadFonts();
    const employeesData = useSelector(state => state.employee.employees);
    const [allProjectData, setAllProjectData] = useState([]);
    const [allTaskData, setAllTaskData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [startTrackTimeVisible, setStartTrackTimeVisible] = useState(false);
    const [stopTrackTimeVisible, setStopTrackTimeVisible] = useState(false);
    const [taskProject, setTaskProject] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [newName, setNewName] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [appIsReady, setAppIsReady] = useState(false);
    const [assignTaskVisible, setAssignTaskVisible] = useState(false);
    const [createTaskVisible, setCreateTaskVisible] = useState(false);
    const [editTaskVisible, setEditTaskVisible] = useState(false);
    const [deleteTaskVisible, setDeleteTaskVisible] = useState(false);

    async function fetchData() {
        try {
            setAppIsReady(false);
            ProjectService.getAllProjects()
                .then((allProjectData) => {
                    setAllProjectData(allProjectData);
                });
        } catch (err) {
            console.warn(err);
        } finally {
            setAppIsReady(true);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData().catch((e) => {
                console.warn(e);
            })
        }, [])
    );

    /**
     * Load in all task data from the selected project
     */
    const getNewTasks = (selectedProject) => {
        if (!selectedProject) {
            return;
        }
        console.log('SelectedProject ', selectedProject);
        taskService.getAllTasks(selectedProject)
            .then((allTaskData) => {
                setAllTaskData(allTaskData);
            });
    };

    const handleCreateTask = () => {
        setTaskProject(selectedProject);
        setCreateTaskVisible(true);
    };

    const handleStartTrackTime = (task) => {
        setSelectedTask(task);
        setStartTrackTimeVisible(true);
    };

    const handleStopTrackTime = (task) => {
        setSelectedTask(task);
        setStopTrackTimeVisible(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setEditTaskVisible(true);
    };

    const handleDeleteTask = (task) => {
        setSelectedTask(task);
        setDeleteTaskVisible(true);
    };

    const handleAssignTask = (task) => {
        setSelectedTask(task);
        setAssignTaskVisible(true);
    };

    const closeModal = () => {
        setStartTrackTimeVisible(false);
        setStopTrackTimeVisible(false);
        setCreateTaskVisible(false);
        setEditTaskVisible(false);
        setDeleteTaskVisible(false);
        setAssignTaskVisible(false);
    };

    const confirmCreateTask = async () => {
        try {
            console.log(taskProject, taskName, taskDescription);

            if (!taskName) {
                Alert.alert('Error', 'Task name cannot be empty', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]);
                return;
            }
            const request = {
                project_id: taskProject,
                name: taskName,
                description: taskDescription
            };

            const response = await taskService.createTask(request);
            const resBody = await response.json();

            if (response.ok) {
                console.log('New task created', resBody);
                closeModal();
                getNewTasks();
                taskService.getAllTasks(selectedProject)
                    .then((allTaskData) => {
                        setAllTaskData(allTaskData);
                    });
                return;
            }
            console.log(resBody);
            closeModal();
        } catch (err) {
            console.log('Error in confirmCreateTask', err);
        }
    };

    const confirmStartTrackTime = async () => {
        try {
            const request = {
                task_id: selectedTask.task_id
            };
            const response = await timeTrackingService.startTaskTrackingTime(request);
            const resBody = await response.json();
            console.log(resBody);
            if (response.ok) {
                console.log('Started tracking time', resBody.start_time);
                Alert.alert('Success', `Started tracking time at ${resBody.start_time}`, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]);
                taskService.getAllTasks(selectedProject)
                    .then((allTaskData) => {
                        setAllTaskData(allTaskData);
                    });
                closeModal();
                return;
            }
            Alert.alert('Error', resBody.message, [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ]);
            closeModal();
        } catch (error) {
            console.log('Error in confirmTrackTime', error);
        }
    };

    const confirmStopTrackTime = async () => {
        try {
            const request = {
                task_id: selectedTask.task_id
            };
            const response = await timeTrackingService.stopTaskTrackingTime(request);
            const resBody = await response.json();
            console.log(resBody);
            if (response.ok) {
                console.log('Stopped tracking time', resBody.stop_time);
                Alert.alert('Success', `Stopped tracking time at ${resBody.stop_time}`, [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]);
                taskService.getAllTasks(selectedProject)
                    .then((allTaskData) => {
                        setAllTaskData(allTaskData);
                    });
                closeModal();
                return;
            }
            Alert.alert('Error', resBody.message, [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ]);
            closeModal();
        } catch (error) {
            console.log('Error in confirmStopTrackTime', error);
        }
    };

    const confirmEditTask = async () => {
        try {
            console.log(selectedTask.task_id, newName, newDescription, newStatus);

            const emptyReq = !newName && !newDescription && !newStatus;

            if (emptyReq) {
                Alert.alert('Error', 'At least one field must be updated', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]);
                return;
            }
            const request = {
                task_id: selectedTask.task_id,
                name: newName,
                description: newDescription,
                status: newStatus
            };

            const response = await taskService.editTask(request);
            const resBody = await response.json();

            if (response.ok) {
                console.log('Edited Task', resBody);
                closeModal();
                getNewTasks(selectedProject);
            }
            console.log(resBody);
            setNewStatus(null);
            closeModal();
        } catch (err) {
            console.log('Error in confirmEditTask', err);
        }
    };

    const confirmDeleteTask = async () => {
        try {
            const response = await taskService.deleteTask(selectedTask.task_id);
            if(response.ok) {
                Alert.alert('Success', `Deleted ${selectedTask.name}`);
                taskService.getAllTasks(selectedProject)
                    .then((allTaskData) => {
                        setAllTaskData(allTaskData);
                    });
                closeModal();
                return;
            }
            Alert.alert('Error', `Could not delete ${selectedTask.name}`);
        } catch (err) {
            console.log('Error at confirmDeleteTask ', err);
        }
    };

    const confirmAssignTask = async () => {
        try {
            if (!selectedEmployee) {
                Alert.alert('Error', 'Employee Username is required', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]);
                return;
            }
            const request = {
                task_id: selectedTask.task_id,
                username: selectedEmployee
            };
            const res = await taskService.assignEmployee(request);
            if (res.status === 200) {
                Alert.alert('Success', `Assigned employee to ${selectedTask.name}`);
            } else {
                const msg = await res.json();
                Alert.alert('Error', `${msg.message}`);
            }
            closeModal();
            getNewTasks(selectedProject);
        } catch (err) {
            console.log('Error in confirmEditTask', err);
        }
    };

    return (

        <View style={[styles.background, { backgroundColor: '#171A21', flex: 1 }]}>
            <View style={styles.center}>
                <View style={styles.topBar}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        placeholder='Select a Project'
                        search
                        searchPlaceholder="Search..."
                        data={allProjectData}
                        labelField='name'
                        valueField='project_id'
                        onChange={ item => {
                            setSelectedProject(item.project_id);
                            getNewTasks(item.project_id);
                        }}
                        onFocus={() => {
                            fetchData();
                        }}
                    />
                    {
                        selectedProject &&
                        <View>
                            <Pressable style={styles.button} onPress={handleCreateTask}>
                                <Text style={{ color: '#ffffff', fontSize: 16 }}>New Task</Text>
                            </Pressable>
                        </View>
                    }
                </View>

                <ManagerTaskListComponent
                    tasksData={allTaskData}
                    onStartTrackTime={handleStartTrackTime}
                    onStopTrackTime={handleStopTrackTime}
                    onEditTask={handleEditTask}
                    onAssignEmployee={handleAssignTask}
                    onDeleteTask={handleDeleteTask}
                />

                <Modal isVisible={startTrackTimeVisible}>
                    <Modal.Container>
                        <View>
                            <Modal.Header/>
                            <Modal.Body>
                                <Text style={styles.boxText}>
                                    Do you want to start time for {selectedTask === null ? '' : selectedTask.name}?
                                </Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Pressable style={styles.cancel} onPress={closeModal}>
                                    <Text style={styles.boxText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={confirmStartTrackTime}>
                                    <Text style={styles.boxText}>Confirm</Text>
                                </Pressable>
                            </Modal.Footer>
                        </View>
                    </Modal.Container>
                </Modal>

                <Modal isVisible={stopTrackTimeVisible}>
                    <Modal.Container>
                        <View>
                            <Modal.Header/>
                            <Modal.Body>
                                <Text style={styles.boxText}>
                                    Do you want to stop time for {selectedTask === null ? '' : selectedTask.name}?
                                </Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Pressable style={styles.cancel} onPress={closeModal}>
                                    <Text style={styles.boxText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={confirmStopTrackTime}>
                                    <Text style={styles.boxText}>Confirm</Text>
                                </Pressable>
                            </Modal.Footer>
                        </View>
                    </Modal.Container>
                </Modal>

                {/* Create Task Popup */}
                <Modal isVisible={createTaskVisible}>
                    <Modal.Container>
                        <View>
                            <Modal.Header/>
                            <Modal.Body>
                                <View style={styles.modalCenter}>
                                    <TextInput
                                        label="Task Name"
                                        style={styles.input}
                                        placeholder="Task Name"
                                        onChangeText={setTaskName}
                                    />
                                    <TextInput
                                        label="Task Description"
                                        style={styles.input}
                                        placeholder="Task Description"
                                        onChangeText={setTaskDescription}
                                    />
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <Pressable style={styles.cancel} onPress={closeModal}>
                                    <Text style={styles.boxText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={confirmCreateTask}>
                                    <Text style={styles.boxText}>Confirm</Text>
                                </Pressable>
                            </Modal.Footer>
                        </View>
                    </Modal.Container>
                </Modal>
                {/* Edit Task Popup */}
                <Modal isVisible={editTaskVisible}>
                    <Modal.Container>
                        <View>
                            <Modal.Header/>
                            <Modal.Body>
                                <View style={styles.modalCenter}>
                                    <TextInput
                                        label="New Task Name"
                                        style={styles.input}
                                        placeholder= {selectedTask === null ? 'New Task Name' : selectedTask.name}
                                        onChangeText={setNewName}
                                    />
                                    <TextInput
                                        label="New Task Description"
                                        style={styles.input}
                                        placeholder={selectedTask === null ? 'New Task Description' : selectedTask.description}
                                        onChangeText={setNewDescription}
                                    />
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        placeholder={selectedTask === null ? 'Select a new status' : selectedTask.status}
                                        data={[
                                            { label: 'NEW', value: 'NEW' },
                                            { label: 'IN-PROGRESS', value: 'IN-PROGRESS' },
                                            { label: 'TESTING', value: 'TESTING' },
                                            { label: 'COMPLETED', value: 'COMPLETED' }
                                        ]}
                                        value={newStatus}
                                        labelField='label'
                                        valueField='value'
                                        onChange={ item => {
                                            setNewStatus(item.value);
                                        }}
                                    />
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <Pressable style={styles.cancel} onPress={closeModal}>
                                    <Text style={styles.boxText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={confirmEditTask}>
                                    <Text style={styles.boxText}>Confirm</Text>
                                </Pressable>
                            </Modal.Footer>
                        </View>
                    </Modal.Container>
                </Modal>
                {/* Delete Task Popup */}
                <Modal isVisible={deleteTaskVisible}>
                    <Modal.Container>
                        <View>
                            <Modal.Header/>
                            <Modal.Body>
                                <View style={styles.modalCenter}>
                                    {selectedTask && (
                                        <Text style={styles.text}>Are you sure you want to delete "{selectedTask.name}"</Text>
                                    )}
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <Pressable style={styles.cancel} onPress={closeModal}>
                                    <Text style={styles.boxText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={confirmDeleteTask}>
                                    <Text style={styles.boxText}>Confirm</Text>
                                </Pressable>
                            </Modal.Footer>
                        </View>
                    </Modal.Container>
                </Modal>
                {/* Assign Task Popup */}
                <Modal isVisible={assignTaskVisible}>
                    <Modal.Container>
                        <View>
                            <Modal.Header title={'Assign an employee'}/>
                            <Modal.Body>
                                <View style={styles.center}>
                                    {/* DROP DOWN */}
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        placeholder='Select Employee'
                                        search
                                        searchPlaceholder="Search..."
                                        data={employeesData}
                                        labelField='first_name'
                                        valueField='username'
                                        onChange={ item => {
                                            setSelectedEmployee(item.username);
                                        }}
                                    />
                                </View>
                            </Modal.Body>
                            <Modal.Footer>
                                <Pressable style={styles.cancel} onPress={closeModal}>
                                    <Text style={styles.boxText}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.button} onPress={confirmAssignTask}>
                                    <Text style={styles.boxText}>Confirm</Text>
                                </Pressable>
                            </Modal.Footer>
                        </View>
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
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1
    },
    topBarText: {
        fontSize: 18,
        color: 'white',
        zIndex: 1,
        fontFamily: 'Poppins_600SemiBold'
    },
    box: {
        backgroundColor: '#2A475E',
        padding: 15,
        margin: 10,
        borderRadius: 5,
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
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    modalCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
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
    text: {
        fontSize: 20,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
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
    }
});

export default ManagerTaskPage;
