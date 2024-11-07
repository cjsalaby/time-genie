import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Border } from '../assets/GlobalStyles';
import Modal from '../components/Modal';
import React, { useEffect, useState } from 'react';
import projectService from '../services/project-service';
import ProjectDataComponent from '../components/ProjectDataComponent';
import taskService from '../services/task-service';
import timeTrackingService from '../services/timetracking-service';
import LoadingScreen from '../components/LoadingScreen';
import EmployeeTaskListComponent from '../components/EmployeeTaskListComponent';
import { Dropdown } from 'react-native-element-dropdown';
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";

const EmployeeTaskPage = () => {
    const [fontsLoaded] = loadFonts();
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [assignedProjectsData, setAssignedProjectsData] = useState([]);
    const [allTaskData, setAllTaskData] = useState([]);
    const [open, setOpen] = useState(false);
    const [projectData, setProjectData] = useState(null);
    const [createTaskVisible, setCreateTaskVisible] = useState(false);
    const [startTrackTimeVisible, setStartTrackTimeVisible] = useState(false);
    const [stopTrackTimeVisible, setStopTrackTimeVisible] = useState(false);
    const [editTaskVisible, setEditTaskVisible] = useState(false);
    const [deleteTaskVisible, setDeleteTaskVisible] = useState(false);
    const [taskProject, setTaskProject] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [newName, setNewName] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [appIsReady, setAppIsReady] = useState(false);

    async function fetchData () {
        try {
            setAppIsReady(false);
            projectService.getAllAssignedProjects()
                .then((assignedProjectsData) => {
                    setAssignedProjectsData(assignedProjectsData);
                });
        } catch (error) {
            console.warn(error);
        } finally {
            setAppIsReady(true);
        }
    }

    async function fetchProjectData() {
        try {
            projectService.getAllAssignedProjects()
                .then((assignedProjectsData) => {
                    setAssignedProjectsData(assignedProjectsData);
                });
        } catch (e) {
            console.warn(e);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData().catch((e) => {
                console.warn(e);
            })
        }, [])
    )

    if (!appIsReady) {
        return <LoadingScreen />;
    }

    const getNewTasks = (selectedProject) => {
        if (!selectedProject) {
            return;
        }
        taskService.getAllTasks(selectedProject)
            .then((allTaskData) => {
                setAllTaskData(allTaskData);
            });
    };

    const getProjectData = (selectedProject) => {
        for (const i in assignedProjectsData) {
            if (assignedProjectsData[i].project_id === selectedProject) {
                return assignedProjectsData[i];
            }
        }
        return null;
    };

    const handleCreateTask = () => {
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
        console.log('Edit Task:', task);
        setSelectedTask(task);
        setEditTaskVisible(true);
    };

    const handleDeleteTask = (task) => {
        setSelectedTask(task);
        setDeleteTaskVisible(true);
    };

    const closeModal = () => {
        setStartTrackTimeVisible(false);
        setStopTrackTimeVisible(false);
        setCreateTaskVisible(false);
        setEditTaskVisible(false);
        setDeleteTaskVisible(false);
    };

    const confirmCreateTask = async () => {
        try {
            console.log(selectedProject, taskName, taskDescription);

            if (!taskName) {
                Alert.alert('Error', 'Task name cannot be empty', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ]);
                return;
            }
            const request = {
                project_id: selectedProject,
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
                    { text: 'OK', onPress: () => {
                            taskService.getAllTasks(selectedProject)
                                .then((allTaskData) => {
                                    setAllTaskData(allTaskData);
                                });
                    }}
                ]);
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
                    { text: 'OK', onPress: () => {
                            taskService.getAllTasks(selectedProject)
                                .then((allTaskData) => {
                                    setAllTaskData(allTaskData);
                                });
                    }}
                ]);
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
                getNewTasks(selectedTask.project_id);
            }
            console.log(resBody);
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

    return (
        <View style={[styles.background, { backgroundColor: '#171A21', flex: 1 }]}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                placeholder='Select a project'
                data={assignedProjectsData}
                labelField='name'
                valueField='project_id'
                value={selectedProject}
                onChange={ item => {
                    setSelectedProject(item.project_id);
                    setProjectData(getProjectData(item.project_id));
                    getNewTasks(item.project_id);
                }}
                onFocus={() => {
                    fetchProjectData();
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
            {
                projectData &&
                <ProjectDataComponent projectData={projectData} />
            }

            <EmployeeTaskListComponent
                tasksData={allTaskData}
                onStartTrackTime={handleStartTrackTime}
                onStopTrackTime={handleStopTrackTime}
                onEditTask={handleEditTask}
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
                            <Pressable style={styles.button} onPress={closeModal}>
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
                            <Pressable style={styles.button} onPress={closeModal}>
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
                            <View style={styles.center}>
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
                            <Pressable style={styles.button} onPress={closeModal}>
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
                            <View style={styles.center}>
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
                            <Pressable style={styles.button} onPress={closeModal}>
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
        color: 'white',
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
    delete_button: {
        padding: 10,
        margin: 15,
        borderRadius: 3,
        backgroundColor: '#ff0000',
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    center: {
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
        right: 0,
        alignItems: 'center'

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
        borderRadius: Border.br_7xs,
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
        backgroundColor: 'white',
        fontFamily: 'Poppins_300Light'
    },
    text: {
        fontSize: 20,
        letterSpacing: 0.25,
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
});

export default EmployeeTaskPage;
