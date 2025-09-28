import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {Model} from '../../entities';

export const modelsApi = createApi({
    reducerPath: 'modelsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://denisplus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479',
        prepareHeaders: (headers, {getState}) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Model'],
    endpoints: (builder) => ({
        getModels: builder.query<Model[], string>({
            query: (userId) => `/models/${userId}`,
            transformResponse: (response: any) => {
                // Извлекаем модели из структуры ответа и конвертируем в правильный формат
                if (response && response.models && Array.isArray(response.models)) {
                    return response.models.map((model: any) => ({
                        id: model.id,
                        name: model.name,
                        modelUrl: model.model_url || '',
                        createdAt: model.created_at, // Оставляем как строку для сериализации
                    }));
                }
                return [];
            },
            providesTags: ['Model'],
        })
    }),
});

export const {
    useGetModelsQuery
} = modelsApi;
