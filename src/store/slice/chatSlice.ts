import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Chat} from '../../entities';

interface ChatState {
    chats: Chat[];
    selectedChatId: string | null;
    selectedChatLocalId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chats: [],
    selectedChatId: null,
    selectedChatLocalId: null,
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.isLoading = false;
            state.chats = action.payload;
            state.error = null;
        },
        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.push(action.payload);
        },
        updateChatFromLocalId: (
            state,
            action: PayloadAction<{ localId: string | null; chat: Chat }>
        ) => {
            const {localId, chat} = action.payload;
            const index = state.chats.findIndex(c => c.localId === localId);
            if (index !== -1) {
                state.chats[index] = chat;
            }
        },
        setSelectedChatId: (state, action: PayloadAction<string | null>) => {
            state.selectedChatId = action.payload;
        },
        setSelectedChatLocalId: (state, action: PayloadAction<string | null>) => {
            state.selectedChatLocalId = action.payload;
        }
    }
});

export const {
    setChats,
    addChat,
    updateChatFromLocalId,
    setSelectedChatId,
    setSelectedChatLocalId,
} = chatSlice.actions;

export default chatSlice.reducer;
