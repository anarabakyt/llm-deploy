import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {User} from '../../entities';

interface UserState {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isLoading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {loginStart, loginSuccess, loginFailure, logout, clearError} = userSlice.actions;
export default userSlice.reducer;
