import React, {useEffect, useState} from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {loadFonts} from "../assets/fonts-helper";
import auth from "../services/auth-service";

const ManagerTaskListComponent = ({ tasksData, onStartTrackTime, onStopTrackTime, onEditTask, onAssignEmployee, onDeleteTask }) => {
    const [user, setUser] = useState(null); // Initialize user state

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await auth.getUserInfo();
                setUser(userInfo);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    const [fontsLoaded] = loadFonts();

    if (!tasksData) {
        return (
            <ScrollView style={styles.scrollView} />
        );
    } else if (tasksData.length === 0) {
        return (
            <ScrollView style={styles.scrollView} />
        );
    }
    return (
        <ScrollView style={styles.scrollView}>
            {tasksData.map((task) => (
                <Card key={task.task_id} style={[styles.card, task.in_progress && styles.active_card]}>
                    <Card.Content style={styles.box}>
                        <Text style={styles.text}>Name: {task.name}</Text>
                        <Text style={styles.text}>Description: {task.description}</Text>
                        <Text style={styles.text}>Status: {task.status}</Text>
                        <Text style={styles.text}>Project: {task.project_name}</Text>
                        <Text style={styles.text}>Start Date: {task.start_date}</Text>
                        <Text style={styles.text}>Assigned Employee: <Text style={styles.names}>{task.assigned_employee}</Text></Text>
                        {task.totalTime && (
                            <>
                                <Text style={styles.text}>Total time: {task.totalTime}</Text>
                                <Text style={styles.text}>Tracking: {task.in_progress ? 'Yes' : 'No'}</Text>
                            </>
                        )}
                    </Card.Content>
                    <Card.Actions style={styles.iconBox}>
                        {task.assigned_employee === user.username && (
                            <>
                                <Pressable onPress={() => onStartTrackTime(task)}>
                                    <MaterialCommunityIcons name="clock-plus" size={20} color="#C7D5E0" style={styles.icon} />
                                </Pressable>
                                <Pressable onPress={() => onStopTrackTime(task)}>
                                    <MaterialCommunityIcons name="clock-remove" size={20} color="#C7D5E0" style={styles.icon} />
                                </Pressable>
                            </>
                        )}
                        <Pressable onPress={() => onEditTask(task)}>
                            <Icon name="pencil" size={20} color="#C7D5E0" style={styles.icon} />
                        </Pressable>
                        <Pressable onPress={() => onAssignEmployee(task)}>
                            <Icon name="plus" size={20} color="#35bd40" style={styles.icon} />
                        </Pressable>
                        <Pressable onPress={() => onDeleteTask(task)}>
                            <Icon name="minus" size={20} color="#ff0000" style={styles.icon} />
                        </Pressable>
                    </Card.Actions>
                </Card>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
        width: '95%'
    },
    cell: {
        backgroundColor: '#2A475E',
        borderWidth: 1,
        borderColor: '#C7D5E0',
        padding: 10,
        marginVertical: 5
    },
    text: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    names: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#35bd40'
    },
    boxHeaders: {
        fontSize: 18,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    iconBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    icon: {
        marginRight: 8
    },
    card: {
        backgroundColor: '#2A475E',
        margin: 5
    },
    box: {
        backgroundColor: '#2A475E',
        padding: 15,
        margin: 5
    },
    active_card: {
        backgroundColor: '#2A475E',
        margin: 5,
        borderWidth: 2,
        borderColor: 'green',
    },
});

export default ManagerTaskListComponent;
