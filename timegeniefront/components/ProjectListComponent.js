import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-paper';
import {loadFonts} from "../assets/fonts-helper";

const AssignedEmployees = ({assignedEmployees}) => {
    if (assignedEmployees == null) {
        return <View></View>;
    }
    return assignedEmployees.length > 0 ? (
        <ScrollView>
            {assignedEmployees.map((assignedEmployee) => (
                <Text key={assignedEmployee} style={styles.names}>{assignedEmployee}</Text>
            ))}
        </ScrollView>
    )
        : <View></View>;
}
const ProjectListComponent = ({ projectsData, onEditProject, onAssignEmployee, onDeleteProject }) => {

    const [fontsLoaded] = loadFonts();

    return (
        <ScrollView style={styles.scrollView}>
            {projectsData.map((project) => (
                <Card key={project.project_id} style={styles.card}>
                    <Card.Content style={styles.box}>
                        <Text style={styles.text}>Name: {project.name}</Text>
                        <Text style={styles.text}>Description: {project.description}</Text>
                        <Text style={styles.text}>Status: {project.status}</Text>
                        <Text style={styles.text}>Health: {project.health}</Text>
                        <Text style={styles.text}>Start Date: {project.start_date}</Text>
                        <Text style={styles.text}>Phase: {project.phase}</Text>
                        <Text style={styles.text}>Assigned Employees:</Text>
                        <AssignedEmployees assignedEmployees={project.assigned_employees}/>
                    </Card.Content>
                    <Card.Actions style={styles.iconBox}>
                        <Pressable onPress={() => onEditProject(project)}>
                            <Icon name="pencil" size={20} color="#C7D5E0" style={styles.icon} />
                        </Pressable>
                        <Pressable onPress={() => onAssignEmployee(project)}>
                            <Icon name="plus" size={20} color="#35bd40" style={styles.icon} />
                        </Pressable>
                        <Pressable onPress={() =>onDeleteProject(project)}>
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
});

export default ProjectListComponent;
