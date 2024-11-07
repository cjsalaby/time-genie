import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View, Animated } from 'react-native';
import React from 'react';
import {loadFonts} from "../assets/fonts-helper";

const HighlightButtonClock = ({ text, onPress, isPressed, isLoading }) => {
    const [fontsLoaded] = loadFonts();

    const getButtonStyle = () => {
        return {
            backgroundColor: isLoading? '#808080' : isPressed ? '#ff0000' : '#35bd40',
            padding: 10,
            left: 30,
            margin: 5,
            borderRadius: 60,
            elevation: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 120,
            width: 120
        };
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={isLoading} // Disable the button when loading
        >
            {isLoading
                ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ActivityIndicator color="#ffffff" size="large" />
                    </View>
                )
                : (
                    <Text style={styles.text}>{text}</Text>
                )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: '#ffffff',
        fontFamily: 'Poppins_300Light'
    }
});

export default HighlightButtonClock;
