import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from '../../config/store.ts';

export const selectUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export const selectModels = (state: RootState) => state.models.models;
export const selectSelectedModelId = (state: RootState) => state.models.selectedModelId;
export const selectSelectedModelUrl = (state: RootState) => state.models.selectedModelUrl;
export const selectModelsLoading = (state: RootState) => state.models.isLoading;
export const selectModelsError = (state: RootState) => state.models.error;

export const selectChats = (state: RootState) => state.chats.chats;
export const selectSelectedChatId = (state: RootState) => state.chats.selectedChatId;
export const selectSelectedChatLocalId = (state: RootState) => state.chats.selectedChatLocalId;
export const selectChatsLoading = (state: RootState) => state.chats.isLoading;
export const selectChatsError = (state: RootState) => state.chats.error;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesLoading = (state: RootState) => state.messages.isLoading;
export const selectMessagesError = (state: RootState) => state.messages.error;

export const selectSelectedChatName = createSelector(
    [selectChats, selectSelectedChatId, selectSelectedChatLocalId],
    (chats, selectedChatId, selectedChatLocalId) => {
        if (selectedChatId) {
            return chats.find(chat => chat.id === selectedChatId)?.name || 'Ask AI';
        } else if (selectedChatLocalId) {
            return chats.find(chat => chat.id === selectedChatLocalId)?.name || 'Ask AI';
        }
        return 'Ask AI';
    }
);

export const selectMessagesByChat = createSelector(
    [selectMessages, selectSelectedChatId, selectSelectedChatLocalId],
    (messages, selectedChatId, selectedChatLocalId) => {
        if (selectedChatId) {
            return messages.filter(message => message.chatId === selectedChatId);
        } else if (selectedChatLocalId) {
            return messages.filter(message => message.chatLocalId === selectedChatLocalId);
        }
        return [];
    }
);
