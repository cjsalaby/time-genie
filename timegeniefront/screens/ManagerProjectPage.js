import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Border, FontSize } from '../assets/GlobalStyles';
import ProjectService from '../services/project-service';
import ProjectListComponent from '../components/ProjectListComponent';
import LoadingScreen from '../components/LoadingScreen';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import {loadFonts} from "../assets/fonts-helper";
import {useFocusEffect} from "@react-navigation/native";

const ManagerProjectPage = () => {
    const [fontsLoaded] = loadFonts();
    const employeesData = useSelector(state => state.employee.employees);
    const [screenIsReady, setScreenIsReady] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectsData, setProjectsData] = useState([]);
    const [error, setError] = useState(null);
    const [assignEmployeeVisible, setAssignEmployeeVisible] = useState(false);
    const [createProjectVisible, setCreateProjectVisible] = useState(false);
    const [editProjectVisible, setEditProjectVisible] = useState(false);
    const [deleteProjectVisible, setDeleteProjectVisible] = useState(false);
    const [newName, setNewName] = useState(null);
    const [newDescription, setNewDescription] = useState(null);
    const [newHealth, setNewHealth] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const [newPhase, setNewPhase] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [appIsReady, setAppIsReady] = useState(false);

    async function fetchData () {
        try {
            setAppIsReady(false);
            ProjectService.getAllProjects().then((items) => {
                setProjectsData(items);
            });
        } catch (error) {
            console.warn(error);
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
    )

    if (!appIsReady) {
        return <LoadingScreen />;
    }

    /**
     * Load in all project data
     */
    const refreshProjects = () => {
        ProjectService.getAllProjects()
            .then((allProjects) => {
                setProjectsData(allProjects);
            });
    };

    const handleAssignEmployee = (project) => {
        setSelectedProject(project);
        setAssignEmployeeVisible(true);
    };

    const handleCreateProject = () => {
        setCreateProjectVisible(true);
    };

    const handleDeleteProject = (project) => {
        setSelectedProject(project);
        setDeleteProjectVisible(true);
    };

    const handleEditProject = (project) => {
        setSelectedProject(project);
        setEditProjectVisible(true);
    };

    const closeModal = () => {
        setAssignEmployeeVisible(false);
        setCreateProjectVisible(false);
        setEditProjectVisible(false);
        setDeleteProjectVisible(false);
    };

    const confirmAssignEmployee = async () => {
        try {
            if (!selectedEmployee) {
                setError('Employee name cannot be empty');
                return closeModal();
            }
            const request = {
                project_id: selectedProject.project_id,
                username: selectedEmployee.username
            };
            const res = await ProjectService.assignEmployee(request);
            if (res.status === 200) {
                Alert.alert('Success', `Assigned employee to ${selectedProject.name}`);
            } else {
                const msg = await res.json();
                Alert.alert('Error', `${msg.message}`);
            }
            refreshProjects();
            closeModal();
        } catch (err) {
            console.log('Error at confirmAssignEmployee ', err);
            throw error;
        }
    };

    const confirmCreateProject = async () => {
        try {
            if (!name) {
                setError('Name cannot be empty');
                return closeModal();
            }
            if (!description) {
                setError('Description cannot be empty');
                return closeModal();
            }
            const request = {
                name,
                description
            };
            const response = await ProjectService.createProject(request);
            if (response.ok) {
                const newProject = await response.json();
                setProjectsData((previousData) => [...previousData, newProject]);
                setName('');
                setDescription('');
                setError(null);
                closeModal();
                refreshProjects();
            }
        } catch (error) {
            console.log('Error at confirmCreateProject: ', error);
            throw error;
        }
    };

    const confirmEditProject = async () => {
        try {
            const emptyReq =
                !newName && !newDescription &&
                !newStatus && !newHealth &&
                !newPhase;
            if (emptyReq) {
                setError('At least one field must be updated.');
                closeModal();
                return;
            }

            const request = {
                project_id: selectedProject.project_id,
                name: newName || selectedProject.name,
                description: newDescription || selectedProject.description,
                status: newStatus || selectedProject.status,
                health: newHealth || selectedProject.health,
                phase: newPhase || selectedProject.phase
            };

            const response = await ProjectService.editProject(request);
            if (response.ok) {
                setProjectsData((previousData) =>
                    previousData.map((project) =>
                        project.project_id === selectedProject.project_id ? { ...project, ...request } : project
                    )
                );
                setNewName('');
                setNewDescription('');
                setNewStatus('');
                setNewHealth('');
                setNewPhase('');
                setError(null);
                closeModal();
                refreshProjects();
            } else {
                closeModal();
            }
        } catch (error) {
            console.log('Error at confirmEditProject: ', error);
            throw error;
        }
    };

    const confirmDeleteProject = async () => {
        try {
            const response = await ProjectService.deleteProject(selectedProject.project_id);
            if(response.ok) {
                Alert.alert('Success', `Deleted ${selectedProject.name}`);
                refreshProjects();
                closeModal();
                return;
            }
            Alert.alert('Error', `Could not delete ${selectedProject.name}`);
        } catch (error) {
            console.log('Error at confirmDeleteProject: ', error);
            throw error;
        }
    }

    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>

            <View style={styles.box}>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={handleCreateProject}>
                        <Text style={{ color: '#ffffff', fontSize: 16 }}>New Project</Text>
                    </Pressable>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <ProjectListComponent projectsData={projectsData} onEditProject={handleEditProject}
                onAssignEmployee={handleAssignEmployee} onDeleteProject={handleDeleteProject} />

            {/* Assign employees popup */}
            <Modal isVisible={assignEmployeeVisible}>
                <Modal.Container>
                    <View>
                        <Modal.Header title={'Assign an employee'}/>
                        <Modal.Body>
                            <View style={styles.center}>
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
                                        setSelectedEmployee(item);
                                    }}
                                />
                            </View>
                        </Modal.Body>
                        <Modal.Footer>
                            <Pressable style={styles.cancel} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmAssignEmployee}>
                                <Text style={styles.boxText}>Confirm</Text>
                            </Pressable>
                        </Modal.Footer>
                    </View>
                </Modal.Container>
            </Modal>

            {/* Create project popup */}
            <Modal isVisible={createProjectVisible}>
                <Modal.Container>
                    <View>
                        <Modal.Header />
                        <Modal.Body>
                            <View style={styles.center}>
                                <TextInput
                                    label="Name"
                                    style={styles.input}
                                    placeholder="Project Name"
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                />
                                <TextInput
                                    label="Description"
                                    style={styles.input}
                                    placeholder="Project Description"
                                    value={description}
                                    onChangeText={(text) => setDescription(text)}
                                />
                            </View>

                        </Modal.Body>
                        <Modal.Footer>
                            <Pressable style={styles.cancel} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmCreateProject}>
                                <Text style={styles.boxText}>Confirm</Text>
                            </Pressable>
                        </Modal.Footer>
                    </View>
                </Modal.Container>
            </Modal>

            {/* delete project popup */}
            <Modal isVisible={deleteProjectVisible}>
                <Modal.Container>
                    <View>
                        <Modal.Header/>
                        <Modal.Body>
                            <View style={styles.modalCenter}>
                                {selectedProject && (
                                    <Text style={styles.text}>Are you sure you want to delete "{selectedProject.name}"</Text>
                                )}
                            </View>
                        </Modal.Body>
                        <Modal.Footer>
                            <Pressable style={styles.cancel} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmDeleteProject}>
                                <Text style={styles.boxText}>Confirm</Text>
                            </Pressable>
                        </Modal.Footer>
                    </View>
                </Modal.Container>
            </Modal>

            {/* Edit project popup */}
            <Modal isVisible={editProjectVisible}>
                <Modal.Container>
                    <View>
                        <Modal.Header />
                        <Modal.Body>
                            <View style={styles.center}>
                                {selectedProject && (
                                    <Text style={styles.text}>Editing: {selectedProject.name}</Text>
                                )}
                                <TextInput
                                    label="Name"
                                    style={styles.input}
                                    placeholder="New Name"
                                    value={newName}
                                    onChangeText={(text) => setNewName(text)}
                                />
                                <TextInput
                                    label="Description"
                                    style={styles.input}
                                    placeholder="New Description"
                                    value={newDescription}
                                    onChangeText={(text) => setNewDescription(text)}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Status'
                                    data={[
                                        { label: 'Active', value: 'ACTIVE' },
                                        { label: 'Completed', value: 'COMPLETED' },
                                        { label: 'Cancelled', value: 'CANCELLED' },
                                        { label: 'On Hold', value: 'ON HOLD' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={newStatus}
                                    onChange={ item => {
                                        setNewStatus(item.value);
                                    }}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Health'
                                    data={[
                                        { label: 'On Track', value: 'On Track' },
                                        { label: 'At Risk', value: 'At Risk' },
                                        { label: 'Off Track', value: 'Off Track' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={newHealth}
                                    onChange={ item => {
                                        setNewHealth(item.value);
                                    }}
                                />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    placeholder='Phase'
                                    data={[
                                        { label: 'Plan & Prepare', value: 'Plan & Prepare' },
                                        { label: 'Build & Manage', value: 'Build & Manage' },
                                        { label: 'Close & Sustain', value: 'Close & Sustain' },
                                        { label: 'Completed', value: 'Completed' }
                                    ]}
                                    labelField='label'
                                    valueField='value'
                                    value={newPhase}
                                    onChange={ item => {
                                        setNewPhase(item.value);
                                    }}
                                />
                            </View>
                        </Modal.Body>
                        <Modal.Footer>
                            <Pressable style={styles.cancel} onPress={closeModal}>
                                <Text style={styles.boxText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={confirmEditProject}>
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
        color: '#C7D5E0'
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
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0'
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

export default ManagerProjectPage;
