import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import { Card } from 'react-native-paper';
import {loadFonts} from "../assets/fonts-helper";
import Icon from "react-native-vector-icons/FontAwesome";
import {formatDate, formatLocation} from "../utils/date-location-helper";

const TimesheetComponent = ({ timesheetData, onEditTimeSheet }) => {

    const [fontsLoaded] = loadFonts();
    return (
        <ScrollView style={styles.scrollView}>
            {timesheetData.map((data, index) => (
                <Card key={index} style={styles.card}>
                    <Card.Content style={styles.box}>
                        <View style={styles.text_box}>
                            <Text style={styles.lead_text}>{`ID: `}</Text>
                            <Text style={styles.text}>{data.timesheet_id}</Text>
                        </View>
                        <View style={styles.text_box}>
                            <Text style={styles.lead_text}>{`Clock In: `}</Text>
                            <Text style={styles.text}>{formatDate(data.clock_in_time)}</Text>
                        </View>
                        <View style={styles.text_box}>
                            <Text style={styles.lead_text}>{`Clock In Location: `}</Text>
                            <Text style={styles.text}>{formatLocation(data.clock_in_location?.x) ?? 'N/A'}, {formatLocation(data.clock_in_location?.y) ?? 'N/A'}</Text>
                        </View>
                        <View style={styles.text_box}>
                            <Text style={styles.lead_text}>{`Clock Out: `}</Text>
                            <Text style={styles.text}>{data.clock_out_time ? formatDate(data.clock_out_time) : 'Currently clocked in.'}</Text>
                        </View>
                        <View style={styles.text_box}>
                            <Text style={styles.lead_text}>{`Clock Out Location: `}</Text>
                            <Text style={styles.text}>{formatLocation(data.clock_out_location?.x) ?? 'N/A'}, {formatLocation(data.clock_out_location?.y) ?? 'N/A'}</Text>
                        </View>
                    </Card.Content>
                    {onEditTimeSheet === null ? null:
                        <Card.Actions style={styles.iconBox}>
                            <Pressable onPress={() => onEditTimeSheet(data)}>
                                <Icon name="pencil" size={20} color="#C7D5E0" style={styles.icon} />
                            </Pressable>
                        </Card.Actions>
                    }
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
        fontSize: 16,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    },
    lead_text: {
        fontSize: 16,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontWeight: 'bold',
        padding: 1,
        fontFamily: 'Poppins_600SemiBold'
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
    },
    iconBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    text_box: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    }
});

export default TimesheetComponent;
