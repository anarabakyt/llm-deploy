import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Chat, Message } from '../entities';

// RTK Query API для работы с чатами
export const chatsApi = createApi({
  reducerPath: 'chatsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://denisplus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479',
    prepareHeaders: (headers, { getState }) => {
      // Добавляем токен авторизации если есть
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Chat', 'Message'],
  endpoints: (builder) => ({
    // Получение всех чатов
    getChats: builder.query<Chat[], string>({
      query: (userId) => `/chats/${userId}`,
      transformResponse: (response: any) => {
        // Извлекаем чаты из структуры ответа и конвертируем в правильный формат
        if (response && response.chats && Array.isArray(response.chats)) {
          return response.chats.map((chat: any) => ({
            id: chat.id,
            modelId: chat.model_id,
            localId: `chat_${chat.id}`, // Генерируем localId на основе id
            createdAt: chat.created_at, // Оставляем как строку для сериализации
          }));
        }
        return [];
      },
      providesTags: ['Chat'],
    }),
    
    // Получение чата по ID
    getChatById: builder.query<Chat, string>({
      query: (id) => `/chats/${id}`,
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    
    // Создание нового чата
    createChat: builder.mutation<Chat, { modelId: string }>({
      query: ({ modelId }) => ({
        url: 'https://denisplus8soft.app.n8n.cloud/webhook-test/chats',
        method: 'POST',
        body: { modelId },
      }),
      transformResponse: (response: any) => {
        // Конвертируем ответ с бэкенда в правильный формат
        return {
          id: response.id,
          modelId: response.model_id,
          localId: `chat_${response.id}`, // Генерируем localId на основе id
          createdAt: response.created_at, // Оставляем как строку для сериализации
        };
      },
      invalidatesTags: ['Chat'],
    }),
    
    // Обновление чата
    updateChat: builder.mutation<Chat, { id: string; updates: Partial<Chat> }>({
      query: ({ id, updates }) => ({
        url: `/chats/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Chat', id }],
    }),
    
    // Удаление чата
    deleteChat: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),
    
    
    // Отправка сообщения в чат
    sendMessage: builder.mutation<Message, { chatId: string; text: string }>({
      query: ({ chatId, text }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: chatId },
        { type: 'Chat', id: chatId },
      ],
    }),
    
    // Отправка сообщения во все модели (фиксированный чат)
    sendToAllModels: builder.mutation<Message, { text: string }>({
      query: ({ text }) => ({
        url: '/messages/broadcast',
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Message'],
    }),
    
    // Получение сообщений фиксированного чата
    getFixedChatMessages: builder.query<Message[], void>({
      query: () => '/messages/fixed-chat',
      providesTags: ['Message'],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const {
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useDeleteChatMutation,
  useSendMessageMutation,
  useSendToAllModelsMutation,
  useGetFixedChatMessagesQuery,
} = chatsApi;
