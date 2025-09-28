import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../config/hooks.ts';
import {
    selectMessagesByChat,
    selectMessagesLoading,
    selectSelectedChatId,
    selectSelectedChatLocalId,
    selectSelectedModelIdBySelectedChat,
    selectSelectedModelUrlBySelectedChat
} from '../store/selector/selectors.ts';
import {setChatMessages} from '../store/slice/messageSlice.ts';
import {useGetChatMessagesQuery} from '../services/rtk';
import {LocalIdGenerator} from '../utils';
import {MessageBubble} from './MessageBubble';
import {ChatInput} from './ChatInput';
import {ResponseCard} from './ResponseCard';
import {Loader} from './Loader';
import type {Chat} from '../entities';
import {setSelectedChatId, setSelectedChatLocalId} from "../store/slice/chatSlice.ts";
import {sendMessageThunk} from "../store/thunk/messageThunks.ts";

export const ChatArea: React.FC = () => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectMessagesByChat);
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const selectedChatLocalId = useAppSelector(selectSelectedChatLocalId);
    const selectedModelId = useAppSelector(selectSelectedModelIdBySelectedChat);
    const selectedModelUrl = useAppSelector(selectSelectedModelUrlBySelectedChat);
    const isLoading = useAppSelector(selectMessagesLoading);

    const [newChat, setNewChat] = useState<Chat | null>(null);
    const [isNewChat, setIsNewChat] = useState(!selectedChatId);

    const {data: reloadedMessages = []} = useGetChatMessagesQuery(
        {chatId: selectedChatId!},
        {skip: !selectedChatId || messages.length > 0}
    );

    useEffect(() => {
        if (reloadedMessages.length > 0 && selectedChatId) {
            dispatch(setChatMessages({chatId: selectedChatId, messages: reloadedMessages}));
        } else {
            dispatch(setSelectedChatId(null));
        }
    }, [reloadedMessages, selectedChatId, dispatch]);

    useEffect(() => {
        if (isNewChat && selectedModelId) {
            const newChatData: Chat = {
                id: null,
                modelId: selectedModelId,
                localId: LocalIdGenerator.generateLocalId(),
                createdAt: new Date().toISOString(),
            };
            setNewChat(newChatData);
            dispatch(setSelectedChatLocalId(newChatData.localId));
        }
    }, [isNewChat, selectedModelId]);

    const handleSendMessage = async (messageText: string) => {
        const newChatCopy = newChat ? {...newChat} : null;

        dispatch(
            sendMessageThunk({
                messageText,
                isNewChat: isNewChat,
                newChat: newChatCopy,
            })
        );

        if (isNewChat) {
            setIsNewChat(false);
            setNewChat(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Заголовок */}
            <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Спросить ИИ
                </h2>
                <p className="text-sm text-gray-500">
                    Отправьте сообщение, чтобы получить ответы от всех доступных моделей
                </p>
            </div>

            {/* Область сообщений */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Сравните ответы AI-моделей
                            </h3>
                            <p className="text-gray-500 max-w-md">
                                Задайте вопрос и получите ответы от всех доступных моделей для сравнения их качества и
                                скорости
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="space-y-4">
                            {/* Сообщение пользователя */}
                            <MessageBubble
                                message={message}
                                isUser={message.author === 'user'}
                            />

                            {/* Ответы моделей */}
                            {message.modelResponses && message.modelResponses.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-600">
                                        Ответы моделей:
                                    </h4>
                                    <div className="space-y-3">
                                        {message.modelResponses.map((response) => (
                                            <ResponseCard
                                                key={response.modelName}
                                                response={response}
                                                messageId={message.id || ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg p-3">
                            <Loader size="sm"/>
                        </div>
                    </div>
                )}
            </div>

            {/* Поле ввода */}
            <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                placeholder="Задайте вопрос для сравнения ответов всех моделей..."
            />
        </div>
    );
};
