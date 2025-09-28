import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {Message} from '../../entities';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://denisplus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479/messages',
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
            transformResponse: (response: any) => {
                if (response && response.messages && Array.isArray(response.messages)) {
                    return response.messages.map((message: any) => {
                        const messageData: Message = {
                            id: message.id,
                            chatId: message.chat_id,
                            chatLocalId: null,
                            author: message.author,
                            content: message.content,
                            createdAt: message.created_at,
                        };

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
            providesTags: (result, error, {chatId}) => [
                {type: 'Message', id: chatId},
            ],
        }),
    }),
});

export const {
    useGetChatMessagesQuery
} = messagesApi;
