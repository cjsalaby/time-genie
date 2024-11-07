import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import React_Native_Modal from 'react-native-modal';
import {loadFonts} from "../assets/fonts-helper";

const ModalContainer = ({ children }) => (
    <View style={styles.container}>
        {children}
    </View>
);

const ModalHeader = ({ title }) => (
    <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
    </View>
);

const ModalBody = ({ children }) => (
    <View style={styles.body}>
        {children}
    </View>
);

const ModalFooter = ({ children }) => (
    <View style={styles.footer}>
        {children}
    </View>
);

const Modal = ({
    isVisible,
    children,
    ...properties
}) => {
    const [fontsLoaded] = loadFonts();
    return (
        <React_Native_Modal
            isVisible={isVisible}
            animationInTiming={400}
            animationIn={'zoomIn'}
            animationOutTiming={400}
            animationOut={'zoomOut'}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={300}
            {...properties}
        >
            {children}
        </React_Native_Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2A475E',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#000',
        borderStyle: 'solid'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 24,
        color: '#C7D5E0'
    },
    text: {
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Poppins_300Light'
    },
    body: {
        justifyContent: 'center',
        paddingHorizontal: 15,
        minHeight: 100,
        zIndex: 2
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        flexDirection: 'row',
        zIndex: 1
    }
});

Modal.Container = ModalContainer;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
export default Modal;
