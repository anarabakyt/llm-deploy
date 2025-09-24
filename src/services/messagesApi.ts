import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Message, ModelResponse } from '../entities';

// Интерфейс для запроса отправки сообщения к модели
interface SendMessageToModelRequest {
  chatId: string;
  modelId: string;
  text: string;
}

// Интерфейс для запроса отправки сообщения ко всем моделям
interface SendMessageToAllModelsRequest {
  text: string;
}

// Интерфейс для ответа API
interface SendMessageResponse {
  userMessage: Message;
  modelResponse?: ModelResponse;
  modelResponses?: ModelResponse[];
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://denisplus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Message', 'Chat'],
  endpoints: (builder) => ({
    // Отправка сообщения к конкретной модели
    sendMessageToModel: builder.mutation<SendMessageResponse, SendMessageToModelRequest>({
      query: ({ chatId, modelId, text }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body: { text, modelId },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: chatId },
        { type: 'Chat', id: chatId },
      ],
    }),

    // Отправка сообщения ко всем моделям
    sendMessageToAllModels: builder.mutation<SendMessageResponse, SendMessageToAllModelsRequest>({
      query: ({ text }) => ({
        url: '/messages/broadcast',
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Message'],
    }),

    // Получение сообщений чата
    getChatMessages: builder.query<Message[], string>({
      query: (chatId) => `/messages/${chatId}`,
      transformResponse: (response: any) => {
        // Извлекаем сообщения из структуры ответа и конвертируем в правильный формат
        if (response && response.messages && Array.isArray(response.messages)) {
          return response.messages.map((message: any) => {
            // Новая структура: каждый message содержит message_with_responses
            const messageData = message.message_with_responses || message;
            
            const result: Message = {
              id: messageData.id,
              chatId: String(messageData.chat_id), // Приводим к строке для совместимости
              author: messageData.author,
              content: messageData.content,
              createdAt: messageData.created_at,
            };

            // Если есть model_responses, конвертируем их
            if (messageData.model_responses && Array.isArray(messageData.model_responses)) {
              result.modelResponses = messageData.model_responses.map((modelResp: any) => ({
                id: modelResp.id,
                messageId: modelResp.message_id,
                modelName: modelResp.model_name,
                content: modelResp.content,
                responseTime: modelResp.response_time,
                createdAt: modelResp.created_at,
              }));
            }

            return result;
          });
        }
        return [];
      },
      providesTags: (result, error, chatId) => [
        { type: 'Message', id: chatId },
      ],
    }),

    // Получение сообщений фиксированного чата
    getFixedChatMessages: builder.query<Message[], { modelUrl: string; chatId: string }>({
      query: ({ modelUrl, chatId }) => ({
        url: `${modelUrl}/${chatId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        // Обрабатываем ответ с model_responses для фиксированного чата
        if (response && response.messages && Array.isArray(response.messages)) {
          return response.messages.map((message: any) => {
            const messageData: Message = {
              id: message.id,
              chatId: message.chat_id,
              author: message.author,
              content: message.content,
              createdAt: message.created_at,
            };

            // Если есть model_responses, конвертируем их
            if (message.model_responses && Array.isArray(message.model_responses)) {
              messageData.modelResponses = message.model_responses.map((modelResp: any) => ({
                id: modelResp.id,
                messageId: modelResp.message_id,
                modelName: modelResp.model_name,
                content: modelResp.content,
                responseTime: modelResp.response_time,
                createdAt: modelResp.created_at,
              }));
            }

            return messageData;
          });
        }
        return [];
      },
      providesTags: (result, error, { chatId }) => [
        { type: 'Message', id: chatId },
      ],
    }),
  }),
});

export const {
  useSendMessageToModelMutation,
  useSendMessageToAllModelsMutation,
  useGetChatMessagesQuery,
  useGetFixedChatMessagesQuery,
} = messagesApi;
