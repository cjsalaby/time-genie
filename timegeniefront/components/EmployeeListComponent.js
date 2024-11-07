import React, {useEffect, useState} from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-paper';
import {loadFonts} from "../assets/fonts-helper";

const EmployeeListComponent = ({ employeesData, onEditEmployee }) => {
    const [fontsLoaded] = loadFonts();
    if (!employeesData) {
        return (
            <ScrollView style={styles.scrollView} />
        );
    } else if (employeesData.length === 0) {
        return (
            <ScrollView style={styles.scrollView} />
        );
    }
    return (
        <ScrollView style={styles.scrollView}>
            {employeesData.map((employee) =>
                employee.roles.includes("MANAGER") ? null :
                (<Card key={employee.emp_id} style={styles.card}>
                    <Card.Content style={styles.box}>
                        <Text style={styles.text}>{employee.first_name} {employee.last_name}</Text>
                        <Text style={styles.text}>{employee.username}</Text>
                        <Text style={styles.text}>{employee.email}</Text>
                        <Text style={styles.text}>Roles: {employee.roles.join(' ')}</Text>
                        <Text style={styles.text}>Employment: {employee.employment_type}</Text>
                        <Text style={styles.text}>Maximum # of Breaks: {employee.max_breaks}</Text>
                        <Text style={styles.text}>Maximum Break Duration: {employee.break_duration}</Text>
                        <Text style={styles.text}>Breaks Remaining: {employee.breaks_remaining}</Text>
                    </Card.Content>
                    <Card.Actions style={styles.iconBox}>
                        <Pressable onPress={() => onEditEmployee(employee)}>
                            <Icon name="pencil" size={20} color="#C7D5E0" style={styles.icon} />
                        </Pressable>
                    </Card.Actions>
                </Card>)
            )}
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
    }
});

export default EmployeeListComponent;
