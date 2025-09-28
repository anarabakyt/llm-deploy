import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Message} from '../../entities';

interface MessageState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    messages: [],
    isLoading: false,
    error: null,
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        updateMessage: (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex(message => message.id === action.payload.id);
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(message => message.id !== action.payload);
        },
        updateMessagesChatIdFromLocalId: (state, action: PayloadAction<{
            localId: string | null;
            newChatId: string
        }>) => {
            state.messages.forEach(message => {
                if (message.chatLocalId === action.payload.localId) {
                    message.chatId = action.payload.newChatId;
                }
            });
        },
        setChatMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
            const {chatId, messages} = action.payload;

            if (state.messages.length === 0) {
                state.messages = messages;
                return;
            }

            const existingIds = new Set(
                state.messages
                    .filter(m => m.chatId === chatId)
                    .map(m => m.id)
            );

            const newMessages = messages.filter(m => !existingIds.has(m.id));
            state.messages.push(...newMessages);
            state.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
    }
});

export const {
    addMessage,
    updateMessage,
    removeMessage,
    updateMessagesChatIdFromLocalId,
    setChatMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
