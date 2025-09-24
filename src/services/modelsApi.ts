import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Model } from '../entities';

// RTK Query API для работы с моделями
export const modelsApi = createApi({
  reducerPath: 'modelsApi',
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
  tagTypes: ['Model'],
  endpoints: (builder) => ({
    // Получение всех моделей
    getModels: builder.query<Model[], string>({
      query: (userId) => `/models/${userId}`,
      transformResponse: (response: any) => {
        // Извлекаем модели из структуры ответа и конвертируем в правильный формат
        if (response && response.models && Array.isArray(response.models)) {
          return response.models.map((model: any) => ({
            id: model.id,
            name: model.name,
            modelUrl: model.model_url || '',
            isFixed: model.is_fixed,
            createdAt: model.created_at, // Оставляем как строку для сериализации
          }));
        }
        return [];
      },
      providesTags: ['Model'],
    }),
    
    // Получение модели по ID
    getModelById: builder.query<Model, string>({
      query: (id) => `/models/${id}`,
      providesTags: (result, error, id) => [{ type: 'Model', id }],
    }),
    
    // Создание новой модели
    createModel: builder.mutation<Model, Partial<Model>>({
      query: (model) => ({
        url: '/models',
        method: 'POST',
        body: model,
      }),
      invalidatesTags: ['Model'],
    }),
    
    // Обновление модели
    updateModel: builder.mutation<Model, { id: string; updates: Partial<Model> }>({
      query: ({ id, updates }) => ({
        url: `/models/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Model', id }],
    }),
    
    // Удаление модели
    deleteModel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/models/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Model'],
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const {
  useGetModelsQuery,
  useGetModelByIdQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = modelsApi;
