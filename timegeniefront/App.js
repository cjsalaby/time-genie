import React, {useEffect} from 'react';
import AppNavigation from './components/AppNavigation';
import { Provider as ReactPaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './state/store.js';
import { initializeApp } from "./utils/initialize-app";

// The provider tag wraps the app with the redux state management, making it available in all parts of the app.
export default function App () {
    useEffect(() => {
        initializeApp();
    }, [])

    return (
        <Provider store={store}>
            <ReactPaperProvider>
                <AppNavigation/>
            </ReactPaperProvider>
        </Provider>
    );
};
