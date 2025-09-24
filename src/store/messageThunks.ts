import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';
import type { Message, Chat, ModelResponse } from '../entities';
import type { RootState } from './index';

// Интерфейс для параметров отправки сообщения к модели
interface SendMessageToModelParams {
  chatId: string;
  modelId: string;
  text: string;
  localId?: string; // Для новых чатов
}

// Интерфейс для параметров отправки сообщения ко всем моделям
interface SendMessageToAllModelsParams {
  text: string;
}

// Интерфейс для ответа API
interface SendMessageResponse {
  userMessage: Message;
  modelResponse?: ModelResponse;
  modelResponses?: ModelResponse[];
  newChat?: Chat; // Для новых чатов
}

/**
 * Thunk для отправки сообщения к конкретной модели
 */
export const sendMessageToModel = createAsyncThunk<
  SendMessageResponse,
  SendMessageToModelParams,
  { state: RootState }
>(
  'messages/sendMessageToModel',
  async ({ chatId, modelId, text, localId }, { getState, dispatch }) => {
    const state = getState();
    
    // Если это новый чат (localId), создаем его через API
    let actualChatId = chatId;
    let newChat: Chat | undefined;
    
    if (localId && chatId.startsWith('temp-')) {
      try {
        // Создаем новый чат через API
        newChat = await apiService.createChat(modelId, localId);
        actualChatId = newChat.id || '';
        
        // Обновляем чат в Redux
        dispatch({
          type: 'chats/updateChat',
          payload: {
            ...state.chats.chats.find(chat => chat.localId === localId),
            id: newChat.id,
            createdAt: newChat.createdAt,
          } as Chat,
        });
      } catch (error) {
        console.error('Error creating new chat:', error);
        throw error;
      }
    }

    try {
      // Отправляем сообщение к модели
      const response = await apiService.sendMessageToModel(actualChatId, modelId, text);
      
      return {
        userMessage: response,
        modelResponse: response.modelResponses ? response.modelResponses[0] : undefined,
        newChat,
      };
    } catch (error) {
      console.error('Error sending message to model:', error);
      throw error;
    }
  }
);

/**
 * Thunk для отправки сообщения ко всем моделям
 */
export const sendMessageToAllModels = createAsyncThunk<
  SendMessageResponse,
  SendMessageToAllModelsParams,
  { state: RootState }
>(
  'messages/sendMessageToAllModels',
  async ({ text }, { getState }) => {
    try {
      // Отправляем сообщение ко всем моделям
      const response = await apiService.sendMessageToAllModels(text);
      
      return {
        userMessage: response.userMessage,
        modelResponses: response.modelResponses,
      };
    } catch (error) {
      console.error('Error sending message to all models:', error);
      throw error;
    }
  }
);

/**
 * Thunk для создания нового чата
 */
export const createNewChat = createAsyncThunk<
  Chat,
  { modelId: string; localId: string },
  { state: RootState }
>(
  'chats/createNewChat',
  async ({ modelId, localId }, { getState }) => {
    try {
      const newChat = await apiService.createChat(modelId, localId);
      return newChat;
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  }
);

/**
 * Thunk для обновления сообщения с новым chatId
 */
export const updateMessageChatId = createAsyncThunk<
  { messageId: string; newChatId: string },
  { messageId: string; newChatId: string },
  { state: RootState }
>(
  'messages/updateMessageChatId',
  async ({ messageId, newChatId }, { getState }) => {
    // Это действие только обновляет Redux, не делает API запрос
    return { messageId, newChatId };
  }
);
