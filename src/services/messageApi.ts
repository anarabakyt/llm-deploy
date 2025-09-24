import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Message, ModelResponse } from '../entities';

// RTK Query API для работы с сообщениями
export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
      // Добавляем токен авторизации если есть
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    // Отправка сообщения к модели
    sendMessageToModel: builder.mutation<Message, { modelUrl: string; chatId: string; content: string }>({
      query: ({ modelUrl, chatId, content }) => ({
        url: `${modelUrl}/${chatId}`,
        method: 'GET',
        params: { content },
      }),
      transformResponse: (response: any) => {
        // Конвертируем ответ с бэкенда в правильный формат
        return {
          id: response.id,
          chatId: String(response.chat_id), // Приводим к строке для совместимости
          author: response.author,
          content: response.content,
          createdAt: response.created_at, // Оставляем как строку для сериализации
        };
      },
      invalidatesTags: ['Message'],
    }),
    // Отправка сообщения к фиксированным моделям (возвращает message с model_responses)
    sendMessageToFixedModels: builder.mutation<Message, { modelUrl: string; chatId: string; content: string }>({
      query: ({ modelUrl, chatId, content }) => ({
        url: `${modelUrl}/${chatId}`,
        method: 'GET',
        params: { content },
      }),
      transformResponse: (response: any) => {
        // Конвертируем ответ с бэкенда в правильный формат
        const message: Message = {
          id: response.message_with_responses.id,
          chatId: String(response.message_with_responses.chat_id), // Приводим к строке для совместимости
          author: response.message_with_responses.author,
          content: response.message_with_responses.content,
          createdAt: response.message_with_responses.created_at,
        };

        // Конвертируем model_responses в ModelResponse[]
        if (response.message_with_responses.model_responses && Array.isArray(response.message_with_responses.model_responses)) {
          message.modelResponses = response.message_with_responses.model_responses.map((modelResp: any) => ({
            id: modelResp.id,
            messageId: modelResp.message_id,
            modelName: modelResp.model_name,
            content: modelResp.content,
            responseTime: modelResp.response_time,
            createdAt: modelResp.created_at,
          }));
        }

        return message;
      },
      invalidatesTags: ['Message'],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const {
  useSendMessageToModelMutation,
  useSendMessageToFixedModelsMutation,
} = messageApi;
