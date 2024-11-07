import { combineReducers, configureStore } from '@reduxjs/toolkit';
import employeeReducer from './features/employee-slice';

/**
 * The main purpose of using the store is to manage global state. Data that should be accessible across multiple
 * components should go in the store.
 * https://react-redux.js.org/tutorials/quick-start#use-redux-state-and-actions-in-react-components
 */

// This function combines all our reducers together. For now we only have 1, but in the future we may have more
const rootReducer = combineReducers({
    employee: employeeReducer
});

// This sets the reducer to the global store
export const store = configureStore({
    reducer: rootReducer
});
