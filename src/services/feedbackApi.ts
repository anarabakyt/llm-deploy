import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ModelResponseFeedback, FeedbackParams } from './feedbackService';

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Feedback'],
  endpoints: (builder) => ({
    // Поставить лайк ответу модели
    likeModelResponse: builder.mutation<ModelResponseFeedback, FeedbackParams>({
      query: ({ messageId, modelName }) => ({
        url: `/messages/${messageId}/responses/${modelName}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { messageId, modelName }) => [
        { type: 'Feedback', id: `${messageId}-${modelName}` },
      ],
    }),

    // Поставить дизлайк ответу модели
    dislikeModelResponse: builder.mutation<ModelResponseFeedback, FeedbackParams>({
      query: ({ messageId, modelName }) => ({
        url: `/messages/${messageId}/responses/${modelName}/dislike`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { messageId, modelName }) => [
        { type: 'Feedback', id: `${messageId}-${modelName}` },
      ],
    }),

    // Убрать лайк/дизлайк с ответа модели
    removeModelResponseFeedback: builder.mutation<ModelResponseFeedback, FeedbackParams>({
      query: ({ messageId, modelName }) => ({
        url: `/messages/${messageId}/responses/${modelName}/feedback`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { messageId, modelName }) => [
        { type: 'Feedback', id: `${messageId}-${modelName}` },
      ],
    }),

    // Получить информацию о feedback для ответа модели
    getModelResponseFeedback: builder.query<ModelResponseFeedback, FeedbackParams>({
      query: ({ messageId, modelName }) => `/messages/${messageId}/responses/${modelName}/feedback`,
      providesTags: (result, error, { messageId, modelName }) => [
        { type: 'Feedback', id: `${messageId}-${modelName}` },
      ],
    }),

    // Получить все feedback для сообщения
    getMessageFeedback: builder.query<ModelResponseFeedback[], string>({
      query: (messageId) => `/messages/${messageId}/feedback`,
      providesTags: (result, error, messageId) => [
        { type: 'Feedback', id: messageId },
      ],
    }),
  }),
});

export const {
  useLikeModelResponseMutation,
  useDislikeModelResponseMutation,
  useRemoveModelResponseFeedbackMutation,
  useGetModelResponseFeedbackQuery,
  useGetMessageFeedbackQuery,
} = feedbackApi;
