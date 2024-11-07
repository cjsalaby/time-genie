import 'react-native-gesture-handler';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MobileLogin from '../screens/MobileLogin';
import EmployeeDashboard from '../screens/EmployeeDashboard';
import ManagerDashboard from '../screens/ManagerDashboard';
import TimesheetPage from '../screens/TimesheetPage';
import EmployeeGeofencePage from "../screens/EmployeeGeofencePage";
import EmployeeBreak from "../screens/EmployeeBreak";
import EmployeeTimeChangeRequestPage from "../screens/EmployeeTimeChangeRequestPage";
import EmployeeTaskPage from '../screens/EmployeeTaskPage';
import ManageEmployeesPage from '../screens/ManageEmployeesPage';
import ManageEmployeesBreaks from "../screens/ManageEmployeeBreaks";
import ManagerProjectPage from '../screens/ManagerProjectPage';
import ManagerTaskPage from '../screens/ManagerTaskPage';
import ManagerEditTimesheets from '../screens/ManagerEditTimesheets';
import ManagerExportTimesheets from '../screens/ManagerExportTimesheets';
import ManagerGeofencePage from '../screens/ManagerGeofencePage';
import ManagerTimeChangeRequestPage from "../screens/ManagerTimeChangeRequestPage";
import {loadFonts} from "../assets/fonts-helper";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';

process.env.TZ = 'UTC';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigation = () => {
    const [fontsLoaded] = loadFonts();
    // @ts-ignore
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#00ADEE' },
                    headerTintColor: '#D3D3D3', borderColor: 'black',
                }}
                style={styles.text}
            >
                <Stack.Screen name="TimeGenie" component={MobileLogin} />
                <Stack.Screen name="manager" component={ManagerDashboard, DrawerManager} options={{ headerShown: false }} />
                <Stack.Screen name="employee" component={EmployeeDashboard, DrawerEmployee} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const LogoutComponent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => props.navigation.navigate('TimeGenie')}>
                    <Text style={styles.text}>Logout</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const DrawerEmployee = () => {
    const [fontsLoaded] = loadFonts();
    return (
        <Drawer.Navigator
            drawerContent={(props) => <LogoutComponent {...props} />}
            screenOptions={{
                drawerLabelStyle: styles.text,
                headerStyle: { backgroundColor: '#00ADEE' },
                headerTintColor: '#D3D3D3',
                borderColor: 'black',
                drawerStyle: {
                    backgroundColor: '#171A21', // '#171A21'
                    width: 240
                },
            }}
        >
            <Drawer.Screen name="Employee Dashboard" component={EmployeeDashboard} />
            <Drawer.Screen name="My Timesheets" component={TimesheetPage} />
            <Drawer.Screen name="My Requests" component={EmployeeTimeChangeRequestPage} />
            <Drawer.Screen name="Manage Tasks" component={EmployeeTaskPage} />
            <Drawer.Screen name="My Geofence" component={EmployeeGeofencePage} />
            <Drawer.Screen name="My Breaks" component={EmployeeBreak} />

        </Drawer.Navigator>
    );
};

const DrawerManager = () => {
    const [fontsLoaded] = loadFonts();
    return (
        <Drawer.Navigator
            drawerContent={(props) => <LogoutComponent {...props} />}
            screenOptions={{
                drawerLabelStyle: styles.text,
                headerStyle: { backgroundColor: '#00ADEE' },
                headerTintColor: '#D3D3D3',
                borderColor: 'black',
                drawerStyle: {
                    backgroundColor: '#171A21', // '#171A21'
                    width: 240
                }
            }}
        >
            <Drawer.Screen name="Manager Dashboard" component={ManagerDashboard} />
            <Drawer.Screen name="My Timesheets" component={TimesheetPage} />
            <Drawer.Screen name="Manage Employees" component={ManageEmployeesPage} />
            <Drawer.Screen name="Employee Breaks" component={ManageEmployeesBreaks} />
            <Drawer.Screen name="Manage Projects" component={ManagerProjectPage} />
            <Drawer.Screen name="Manage Tasks" component={ManagerTaskPage} />
            <Drawer.Screen name={'Edit Timesheets'} component={ManagerEditTimesheets} />
            <Drawer.Screen name="Review Time Requests" component={ManagerTimeChangeRequestPage} />
            <Drawer.Screen name={'Export Timesheets'} component={ManagerExportTimesheets} />
            <Drawer.Screen name={'Manage Geofence'} component={ManagerGeofencePage} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#DCD6E9',
        fontFamily: 'Poppins_300Light'
    }
});
export default AppNavigation;
