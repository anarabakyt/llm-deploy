import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Chat } from '../entities';
import { createNewChat } from './messageThunks';

interface ChatState {
  chats: Chat[];
  selectedChatId: string | null;
  isFixedChatActive: boolean;
  fixedChatId: string | null; // ID текущего фиксированного чата
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
  isFixedChatActive: false,
  fixedChatId: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    fetchChatsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchChatsSuccess: (state, action: PayloadAction<Chat[]>) => {
      state.isLoading = false;
      state.chats = action.payload;
      state.error = null;
    },
    fetchChatsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.push(action.payload);
      state.selectedChatId = action.payload.id;
      state.isFixedChatActive = false;
    },
    addChatWithLocalId: (state, action: PayloadAction<Chat>) => {
      // Добавляем чат с LocalId (для новых чатов)
      state.chats.push(action.payload);
      state.selectedChatId = action.payload.localId; // Используем localId для выбора
      state.isFixedChatActive = false;
    },
    updateChatFromLocalId: (state, action: PayloadAction<{ localId: string; chat: Chat }>) => {
      // Обновляем чат, заменяя localId на реальный id
      const index = state.chats.findIndex(chat => chat.localId === action.payload.localId);
      if (index !== -1) {
        state.chats[index] = action.payload.chat;
        // Если это выбранный чат, обновляем selectedChatId
        if (state.selectedChatId === action.payload.localId) {
          state.selectedChatId = action.payload.chat.id;
        }
      }
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(chat => chat.id === action.payload.id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },
    selectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
      state.isFixedChatActive = false;
    },
    selectFixedChat: (state, action: PayloadAction<string | null>) => {
      state.isFixedChatActive = true;
      state.selectedChatId = null;
      state.fixedChatId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedChatId = null;
      state.isFixedChatActive = false;
      state.fixedChatId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Обработка создания нового чата
    builder
      .addCase(createNewChat.fulfilled, (state, action) => {
        // Обновляем чат с временным ID на реальный
        const tempChatIndex = state.chats.findIndex(
          chat => chat.localId === action.payload.localId
        );
        if (tempChatIndex !== -1) {
          state.chats[tempChatIndex] = action.payload;
        } else {
          state.chats.push(action.payload);
        }
      });
  },
});

export const {
  fetchChatsStart,
  fetchChatsSuccess,
  fetchChatsFailure,
  addChat,
  addChatWithLocalId,
  updateChatFromLocalId,
  updateChat,
  removeChat,
  selectChat,
  selectFixedChat,
  clearSelection,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
