import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import breakService from '../services/break-service';
import { FontSize } from '../assets/GlobalStyles';
import BreakComponent from '../components/BreakComponent';
import { Card } from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen';
import HighlightButton from '../components/HighlightButton';
import { loadFonts } from "../assets/fonts-helper";
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const EmployeeBreak = () => {

    const [fontsLoaded] = loadFonts();
    const [screenIsReady, setScreenIsReady] = useState(false);
    const [breakData, setBreakData] = useState([]);

    async function fetchData () {
        try {
            const breakData = await breakService.getBreaks();
            setBreakData(breakData);
        } catch (err) {
            console.warn(err);
            throw err;
        } finally {
            setScreenIsReady(true);
        }
    }

    useEffect(() => {
        async function refreshData() {
            try {
                await fetchData();
            } catch (e) {
                console.warn(e);
            }
        }
        refreshData().catch((e) => {
            console.warn(e);
        });
     }, [screenIsReady]);

    useFocusEffect(() => {
        async function refreshData() {
            try {
                await fetchData();
            } catch (e) {
                console.warn(e);
            }
        }
        refreshData().catch((e) => {
            console.warn(e);
        });
    });

    if (!screenIsReady) {
        return <LoadingScreen />;
    }
    return (
        <View style={{ backgroundColor: '#171A21', flex: 1 }}>
            <BreakComponent breakData={breakData} />
        </View>
    );
};

const styles = StyleSheet.create({

    topBar: {
        backgroundColor: '#2A475E',
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBarText: {
        fontSize: 18,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light',
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
    boxHeaders: {
        fontSize: 18,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light',
    },
    boxText: {
        fontSize: 15,
        letterSpacing: 0.25,
        color: '#C7D5E0',
        fontFamily: 'Poppins_300Light',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    actions: {
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Poppins_300Light',
        marginTop: 5
    },
    header: {
        fontSize: FontSize.size_5xl,
        lineHeight: 25,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#C7D5E0',
    }
});

export default EmployeeBreak;
