import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';

const ButtonComponent = ({ onPress, title, backgroundColor }) => (
    <Pressable style={styles.button} >
        <Text style={styles.text}>{title}</Text>

    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 2,
        backgroundColor: '#35bd40',
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light'
    }
});
