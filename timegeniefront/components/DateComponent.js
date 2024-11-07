import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {loadFonts} from "../assets/fonts-helper";

const CurrentDate = () => {
    const [fontsLoaded] = loadFonts();
    const currentDate = new Date();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    function getSuffix (number) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    const formattedDate = `${month} ${day}${getSuffix(day)}, ${year}`;

    return <Text style={styles.date}>{formattedDate}</Text>;
};

const styles = StyleSheet.create({
    date: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    }
});

export default CurrentDate;
