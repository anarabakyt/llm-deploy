import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from '../../config/store.ts';

export const selectUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export const selectModels = (state: RootState) => state.models.models;
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

export const selectSelectedModelIdBySelectedChat = createSelector(
    [selectModels, selectChats, selectSelectedChatId, selectSelectedChatLocalId],
    (models, chats, selectedChatId, selectedChatLocalId) => {
        let selectedChat = null;

        if (selectedChatId) {
            selectedChat = chats.find(chat => chat.id === selectedChatId) || null;
        } else if (selectedChatLocalId) {
            selectedChat = chats.find(chat => chat.localId === selectedChatLocalId) || null;
        }

        if (!selectedChat) {
            return null;
        }

        return models.find(model => model.id === selectedChat.modelId)?.id || null;
    }
);

export const selectSelectedModelUrlBySelectedChat = createSelector(
    [selectModels, selectChats, selectSelectedChatId, selectSelectedChatLocalId],
    (models, chats, selectedChatId, selectedChatLocalId) => {
        let selectedChat = null;

        if (selectedChatId) {
            selectedChat = chats.find(chat => chat.id === selectedChatId) || null;
        } else if (selectedChatLocalId) {
            selectedChat = chats.find(chat => chat.localId === selectedChatLocalId) || null;
        }

        if (!selectedChat) {
            return null;
        }

        return models.find(model => model.id === selectedChat.modelId)?.modelUrl || null;
    }
);
