import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import {loadFonts} from "../assets/fonts-helper";

const ProjectDataComponent = ({ projectData }) => {
    const [fontsLoaded] = loadFonts();
    return (
        <Card style={styles.card}>
            <Card.Content style={styles.box}>
                <View style={styles.topBar}>
                    <Text style={styles.topBarText}>{'Current Project'}</Text>
                </View>
                <Text style={styles.text}>{`Project: ${projectData.name}`}</Text>
                <Text style={styles.text}>{`Description: ${projectData.description}`}</Text>
                <Text style={styles.text}>{`Start Date: ${projectData.start_date}`}</Text>
                <Text style={styles.text}>{`End Date ETA: ${projectData.estimated_end_date}`}</Text>
                <Text style={styles.text}>{`Status: ${projectData.status}`}</Text>
                <Text style={styles.text}>{`Health: ${projectData.health}`}</Text>
                <Text style={styles.text}>{`Phase: ${projectData.phase}`}</Text>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        alignItems: 'center'
    },
    topBarText: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_600SemiBold'
    },
    text: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    card: {
        backgroundColor: '#2A475E',
        width: '95%',
        margin: 5
    },
    box: {
        backgroundColor: '#2A475E',
        padding: 15,
        margin: 5,
        width: '95%' // Adjust as needed

    }
});

export default ProjectDataComponent;
