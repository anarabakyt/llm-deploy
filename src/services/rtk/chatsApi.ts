import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {Chat} from '../../entities';

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://plus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479',
        prepareHeaders: (headers, {getState}) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Chat', 'Message'],
    endpoints: (builder) => ({
        getChats: builder.query<Chat[], string>({
            query: (userId) => `/chats/${userId}`,
            transformResponse: (response: any) => {
                // Извлекаем чаты из структуры ответа и конвертируем в правильный формат
                if (response && response.chats && Array.isArray(response.chats)) {
                    return response.chats.map((chat: any) => ({
                        id: chat.id,
                        modelId: chat.model_id,
                        localId: null,
                        name: chat.name,
                        createdAt: chat.created_at, // Оставляем как строку для сериализации
                    }));
                }
                return [];
            },
            providesTags: ['Chat'],
        }),
    }),
});

export const {
    useGetChatsQuery
} = chatsApi;
