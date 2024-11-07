import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {loadFonts} from "../assets/fonts-helper";
import {formatDate, formatLocation} from "../utils/date-location-helper";


const EditableTimesheetComponent = ({ timesheetData, onEdit, onApprove, onDisapprove }) => {
    const [fontsLoaded] = loadFonts();
    if (!timesheetData) {
        return (
            <ScrollView style={styles.scrollView} />
        );
    } else if (timesheetData.length === 0) {
        return (
            <ScrollView style={styles.scrollView} />
        );
    }
    return (
        <ScrollView style={styles.scrollView}>
            {timesheetData.map((data) => (
                <Card
                    key={data.timesheet_id}
                    style={[
                        styles.card,
                        (data.is_approved === false || data.is_approved === null) ? styles.card_red : {},
                    ]}>
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
                    <Card.Actions style={styles.iconBox}>
                        {data.is_approved === false || data.is_approved === null ? (
                            <Pressable onPress={() => onApprove(data)}>
                                <Icon name="check" size={20} color="#35bd40" style={styles.icon} />
                            </Pressable>
                        ) : (
                            <Pressable onPress={() => onDisapprove(data)}>
                                <Icon name="close" size={20} color="#ff0000" style={styles.icon} />
                            </Pressable>
                        )}
                        <Pressable onPress={() => onEdit(data)}>
                            <Icon name="pencil" size={20} color="#C7D5E0" style={styles.icon} />
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
        width: '100%'
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
        margin: 5,
        borderColor: '#35bd40',
        borderWidth: 2,
    },
    card_red: {
        backgroundColor: '#2A475E',
        margin: 5,
        borderColor: 'red',
        borderWidth: 2,
    },
    card_yellow: {
        backgroundColor: '#2A475E',
        margin: 5,
        borderColor: 'yellow',
        borderWidth: 2,
    },
    box: {
        backgroundColor: '#2A475E',
        padding: 15,
        margin: 5
    },
    text_box: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    }
});

export default EditableTimesheetComponent;
