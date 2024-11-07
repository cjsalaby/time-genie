import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { parseISO } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { Card } from 'react-native-paper';
import {loadFonts} from "../assets/fonts-helper";

const formatDate = (dateString) => {
    const parseDate = parseISO(dateString);
    const zoneDate = utcToZonedTime(parseDate, 'UTC');
    return format(zoneDate, 'hh:mm:ss a, yyyy-MM-dd', 'UTC');
};

const EmployeeBreak = ({ breakData }) => {
    const [fontsLoaded] = loadFonts();
    return (
        <ScrollView style={styles.scrollView}>
            {breakData.map((entry, index) => (
                <Card key={index} style={styles.card}>
                    <Card.Content style={styles.box}>
                        <Text style={styles.text}>{`Start Break: ${entry.start_time ? formatDate(entry.start_time) : 'Not Found'}`}</Text>
                        <Text style={styles.text}>{`Stop Break: ${entry.stop_time ? formatDate(entry.stop_time) : 'Currently on Break.'}`}</Text>
                    </Card.Content>
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

export default EmployeeBreak;
