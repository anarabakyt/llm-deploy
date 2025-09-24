import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message, ModelResponse } from '../entities';
import { sendMessageToModel, sendMessageToAllModels, updateMessageChatId } from './messageThunks';

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
    fetchMessagesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action: PayloadAction<Message[]>) => {
      state.isLoading = false;
      state.messages = action.payload;
      state.error = null;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
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
    addModelResponse: (state, action: PayloadAction<{ messageId: string; response: ModelResponse }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.messageId);
      if (message) {
        if (!message.modelResponses) {
          message.modelResponses = [];
        }
        message.modelResponses.push(action.payload.response);
      }
    },
    updateModelResponse: (state, action: PayloadAction<{ messageId: string; modelName: string; response: ModelResponse }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.messageId);
      if (message && message.modelResponses) {
        const responseIndex = message.modelResponses.findIndex(
          resp => resp.modelName === action.payload.modelName
        );
        if (responseIndex !== -1) {
          message.modelResponses[responseIndex] = action.payload.response;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    // Обновление chatId для всех сообщений чата при переходе от LocalId к реальному id
    updateMessagesChatIdFromLocalId: (state, action: PayloadAction<{ localId: string; newChatId: string }>) => {
      state.messages.forEach(message => {
        if (message.chatId === action.payload.localId) {
          message.chatId = action.payload.newChatId;
        }
      });
    },
    // Замена сообщений чата (удаляем старые и добавляем новые)
    setChatMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      // Удаляем все сообщения для этого чата
      state.messages = state.messages.filter(message => message.chatId !== action.payload.chatId);
      // Добавляем новые сообщения
      state.messages.push(...action.payload.messages);
    },
    // Добавление сообщений чата только если их еще нет (для загрузки с бэкенда)
    addChatMessagesIfNotExists: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const existingMessageIds = new Set(
        state.messages
          .filter(message => message.chatId === action.payload.chatId)
          .map(message => message.id)
      );
      
      // Добавляем только те сообщения, которых еще нет
      const newMessages = action.payload.messages.filter(
        message => !existingMessageIds.has(message.id)
      );
      
      state.messages.push(...newMessages);
    },
  },
  extraReducers: (builder) => {
    // Обработка sendMessageToModel
    builder
      .addCase(sendMessageToModel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessageToModel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        // Обновляем сообщение пользователя
        const userMessageIndex = state.messages.findIndex(
          msg => msg.id === action.payload.userMessage.id
        );
        if (userMessageIndex !== -1) {
          state.messages[userMessageIndex] = action.payload.userMessage;
        } else {
          state.messages.push(action.payload.userMessage);
        }
        
        // Добавляем ответ модели, если есть
        if (action.payload.modelResponse) {
          const modelMessage: Message = {
            id: `msg-${Date.now()}-model`,
            chatId: action.payload.userMessage.chatId,
            author: 'model',
            content: action.payload.modelResponse.content,
            createdAt: new Date(),
            modelResponses: [action.payload.modelResponse],
          };
          state.messages.push(modelMessage);
        }
      })
      .addCase(sendMessageToModel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';
      });

    // Обработка sendMessageToAllModels
    builder
      .addCase(sendMessageToAllModels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessageToAllModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        // Обновляем сообщение пользователя
        const userMessageIndex = state.messages.findIndex(
          msg => msg.id === action.payload.userMessage.id
        );
        if (userMessageIndex !== -1) {
          state.messages[userMessageIndex] = action.payload.userMessage;
        } else {
          state.messages.push(action.payload.userMessage);
        }
        
        // Добавляем ответы всех моделей как modelResponses к сообщению пользователя
        if (action.payload.modelResponses && action.payload.modelResponses.length > 0) {
          // Находим сообщение пользователя и добавляем к нему modelResponses
          const userMessageIndex = state.messages.findIndex(
            msg => msg.id === action.payload.userMessage.id
          );
          if (userMessageIndex !== -1) {
            state.messages[userMessageIndex].modelResponses = action.payload.modelResponses;
          }
        }
      })
      .addCase(sendMessageToAllModels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message to all models';
      });

    // Обработка updateMessageChatId
    builder
      .addCase(updateMessageChatId.fulfilled, (state, action) => {
        const message = state.messages.find(msg => msg.id === action.payload.messageId);
        if (message) {
          message.chatId = action.payload.newChatId;
        }
      });
  },
});

export const {
  fetchMessagesStart,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  addMessage,
  updateMessage,
  removeMessage,
  addModelResponse,
  updateModelResponse,
  clearMessages,
  clearError,
  updateMessagesChatIdFromLocalId,
  setChatMessages,
  addChatMessagesIfNotExists,
} = messageSlice.actions;

export default messageSlice.reducer;
