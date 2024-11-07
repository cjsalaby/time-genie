import { createSlice } from '@reduxjs/toolkit';

export const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        employees: []
    },
    // Here you define reducers. You can think of these as functions that enable you to change your state
    reducers: {
        setGlobalEmployees: (state, action) => {
            state.employees = action.payload;
        }
    }
});

export const { setGlobalEmployees } = employeeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectGlobalEmployees = state => state.username.value;

export default employeeSlice.reducer;
