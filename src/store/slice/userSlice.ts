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
        setUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const {loginStart, loginFailure, logout, clearError, setUser} = userSlice.actions;
export default userSlice.reducer;
