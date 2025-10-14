import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../store/slice/userSlice.ts';
import modelReducer from '../store/slice/modelSlice.ts';
import chatReducer from '../store/slice/chatSlice.ts';
import messageReducer from '../store/slice/messageSlice.ts';
import loggingReducer from '../store/slice/loggingSlice.ts';
import {chatsApi, messagesApi, modelsApi} from '../services/rtk';

export const store = configureStore({
    reducer: {
        user: userReducer,
        models: modelReducer,
        chats: chatReducer,
        messages: messageReducer,
        logging: loggingReducer,
        [modelsApi.reducerPath]: modelsApi.reducer,
        [chatsApi.reducerPath]: chatsApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
