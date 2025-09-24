import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import modelReducer from './modelSlice';
import chatReducer from './chatSlice';
import messageReducer from './messageSlice';
import feedbackReducer from './feedbackSlice';
import { modelsApi } from '../services/modelsApi';
import { chatsApi } from '../services/chatsApi';
import { messagesApi } from '../services/messagesApi';
import { messageApi } from '../services/messageApi';
import { feedbackApi } from '../services/feedbackApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    models: modelReducer,
    chats: chatReducer,
    messages: messageReducer,
    feedback: feedbackReducer,
    [modelsApi.reducerPath]: modelsApi.reducer,
    [chatsApi.reducerPath]: chatsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
            .concat(modelsApi.middleware)
            .concat(chatsApi.middleware)
            .concat(messagesApi.middleware)
            .concat(messageApi.middleware)
            .concat(feedbackApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
