import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {Message} from '../../entities';

// todo deprecated
export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://plus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479/messages',
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
        getChatMessages: builder.query<Message[], { chatId: string }>({
            query: ({chatId}) => ({
                url: `/${chatId}`,
                method: 'GET',
            }),
            transformResponse: (response: any): Message[] => {
                return response?.messages?.map(({message_with_responses: base}: any) => ({
                    id: base.id,
                    chatId: base.chat_id,
                    chatLocalId: null,
                    author: base.author,
                    content: base.content,
                    createdAt: base.created_at,
                    modelResponses: base.model_responses?.map(({
                                                                   id,
                                                                   message_id,
                                                                   model_name,
                                                                   content,
                                                                   response_time,
                                                                   created_at
                                                               }: any) => ({
                        id,
                        messageId: message_id,
                        modelName: model_name,
                        content,
                        responseTime: response_time,
                        createdAt: created_at,
                    })) ?? []
                })) ?? [];
            },
            providesTags: (result, error, {chatId}) => [
                {type: 'Message', id: chatId},
            ],
        }),
    }),
});

export const {
    useGetChatMessagesQuery
} = messagesApi;
