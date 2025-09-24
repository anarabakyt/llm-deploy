import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Chat, Model, Message } from '../entities';

// Базовые селекторы
export const selectUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export const selectModels = (state: RootState) => state.models.models;
export const selectModelsLoading = (state: RootState) => state.models.isLoading;
export const selectModelsError = (state: RootState) => state.models.error;

export const selectChats = (state: RootState) => state.chats.chats;
export const selectSelectedChatId = (state: RootState) => state.chats.selectedChatId;
export const selectIsFixedChatActive = (state: RootState) => state.chats.isFixedChatActive;
export const selectFixedChatId = (state: RootState) => state.chats.fixedChatId;
export const selectChatsLoading = (state: RootState) => state.chats.isLoading;
export const selectChatsError = (state: RootState) => state.chats.error;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesLoading = (state: RootState) => state.messages.isLoading;
export const selectMessagesError = (state: RootState) => state.messages.error;

// Сложные селекторы
export const selectSelectedChat = createSelector(
  [selectChats, selectSelectedChatId],
  (chats, selectedChatId) => {
    if (!selectedChatId) return null;
    return chats.find(chat => chat.id === selectedChatId) || null;
  }
);

export const selectChatsByModel = createSelector(
  [selectChats],
  (chats) => {
    return chats.reduce((acc, chat) => {
      if (!acc[chat.modelId]) {
        acc[chat.modelId] = [];
      }
      acc[chat.modelId].push(chat);
      return acc;
    }, {} as Record<string, Chat[]>);
  }
);

export const selectMessagesByChat = createSelector(
  [selectMessages, selectSelectedChatId, selectIsFixedChatActive, selectFixedChatId],
  (messages, selectedChatId, isFixedChatActive, fixedChatId) => {
    if (isFixedChatActive) {
      // Для фиксированного чата возвращаем сообщения конкретного чата
      if (!fixedChatId) return [];
      return messages.filter(message => message.chatId === fixedChatId);
    }
    if (!selectedChatId) return [];
    return messages.filter(message => message.chatId === selectedChatId);
  }
);

export const selectModelById = createSelector(
  [selectModels],
  (models) => (modelId: string) => {
    return models.find(model => model.id === modelId) || null;
  }
);

export const selectChatById = createSelector(
  [selectChats],
  (chats) => (chatId: string) => {
    return chats.find(chat => chat.id === chatId) || null;
  }
);

export const selectMessageById = createSelector(
  [selectMessages],
  (messages) => (messageId: string) => {
    return messages.find(message => message.id === messageId) || null;
  }
);

export const selectFixedModels = createSelector(
  [selectModels],
  (models) => models.filter(model => model.isFixed)
);

export const selectRegularModels = createSelector(
  [selectModels],
  (models) => models.filter(model => !model.isFixed)
);

export const selectChatsForModel = createSelector(
  [selectChats],
  (chats) => (modelId: string) => {
    return chats.filter(chat => chat.modelId === modelId);
  }
);

// Селектор для получения чатов фиксированной модели
export const selectFixedModelChats = createSelector(
  [selectChats, selectFixedModels],
  (chats, fixedModels) => {
    if (fixedModels.length === 0) return [];
    const fixedModelId = fixedModels[0].id;
    return chats.filter(chat => chat.modelId === fixedModelId);
  }
);

export const selectRecentChats = createSelector(
  [selectChats],
  (chats) => {
    return [...chats]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }
);

export const selectUnreadMessagesCount = createSelector(
  [selectMessages],
  (messages) => {
    return messages.filter(message => 
      message.author === 'model'
    ).length;
  }
);

export const selectIsAuthenticated = createSelector(
  [selectUser],
  (user) => user !== null
);

export const selectCurrentModel = createSelector(
  [selectSelectedChat, selectModels],
  (selectedChat, models) => {
    if (!selectedChat) return null;
    return models.find(model => model.id === selectedChat.modelId) || null;
  }
);

// Селектор для получения сообщений по localId чата
export const selectMessagesByLocalId = createSelector(
  [selectMessages, selectChats, (state: RootState, localId: string) => localId],
  (messages, chats, localId) => {
    // Находим чат по localId
    const chat = chats.find(chat => chat.localId === localId);
    if (!chat) return [];
    
    // Возвращаем сообщения для этого чата
    return messages.filter(message => message.chatId === chat.id);
  }
);

// Селектор для получения сообщений по chatId
export const selectMessagesByChatId = createSelector(
  [selectMessages, (state: RootState, chatId: string) => chatId],
  (messages, chatId) => {
    return messages.filter(message => message.chatId === chatId);
  }
);

// Селекторы для feedback
export const selectFeedback = (state: RootState) => state.feedback.feedbacks;
export const selectFeedbackLoading = (state: RootState) => state.feedback.isLoading;
export const selectFeedbackError = (state: RootState) => state.feedback.error;

// Селектор для получения feedback конкретного ответа модели
export const selectModelResponseFeedback = createSelector(
  [selectFeedback, (state: RootState, messageId: string, modelName: string) => ({ messageId, modelName })],
  (feedbacks, { messageId, modelName }) => {
    const key = `${messageId}-${modelName}`;
    return feedbacks[key] || {
      messageId,
      modelName,
      isLiked: false,
      isDisliked: false,
      feedbackCount: { likes: 0, dislikes: 0 },
    };
  }
);
