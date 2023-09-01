import { TimedUser } from "@/helpers/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    isSubmitting: boolean, 
    message: {text: string, isError: boolean} | null,
    user: TimedUser | null,
    authChecked: boolean
} = {
    isSubmitting: false,
    message: null,
    user: null,
    authChecked: false
};

const general = createSlice({
    name: 'general',
    initialState,
    reducers: {
        flashToast(state, action) {
            state.message = action.payload;
            state.isSubmitting = false;
        },
        logIn(state, action) {
            state.user = action.payload;
            state.message = null;
            state.isSubmitting = false;
        },
        logOut(state) {
            state.user = null;
            state.message = {text: "You've been logged out", isError: false};
        },
        setSubmitting(state, action) {
            state.isSubmitting = action.payload;
        },
    }
});

export const generalReducer = general.reducer;
export const generalActions = general.actions;