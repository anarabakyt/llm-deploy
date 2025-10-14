import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../config/hooks.ts';
import {
    selectMessagesByChat,
    selectMessagesLoading,
    selectSelectedChatId,
    selectSelectedChatLocalId,
    selectSelectedChatName,
    selectSelectedModelId
} from '../store/selector/selectors.ts';
import {LocalIdGenerator} from '../utils';
import {MessageBubble} from './MessageBubble';
import {ChatInput} from './ChatInput';
import {ResponseCard} from './ResponseCard';
import {Loader} from './Loader';
import {MidConversationLLMSelector} from './MidConversationLLMSelector';
import {InviteUsersModal} from './InviteUsersModal';
import type {Chat} from '../entities';
import {setSelectedChatLocalId} from "../store/slice/chatSlice.ts";
import {sendMessageThunk, sendMessageWithContextTransferThunk} from "../store/thunk/messageThunks.ts";

export const ChatArea: React.FC = () => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectMessagesByChat);
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const selectedChatLocalId = useAppSelector(selectSelectedChatLocalId);
    const selectedChatName = useAppSelector(selectSelectedChatName);
    const selectedModelId = useAppSelector(selectSelectedModelId);
    const isLoading = useAppSelector(selectMessagesLoading);

    const [newChat, setNewChat] = useState<Chat | null>(null);
    const [showLLMSelector, setShowLLMSelector] = useState(false);
    const [contextTransferMode, setContextTransferMode] = useState<'next' | 'conversation' | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        console.log('==> ChatArea: selectedChatId: ', selectedChatId);
        console.log('==> ChatArea: selectedModelId: ', selectedModelId);
        console.log('==> ChatArea: messages.length: ', messages.length);
        if (!selectedChatId && selectedModelId) {
            const newChatData: Chat = {
                id: null,
                modelId: selectedModelId,
                localId: LocalIdGenerator.generateLocalId(),
                name: 'Ask AI ' + (new Date()).toLocaleTimeString(),
                createdAt: new Date().toISOString(),
            };
            setNewChat(newChatData);
            dispatch(setSelectedChatLocalId(newChatData.localId));
        } else {
            setNewChat(null);
        }
    }, [selectedChatId, selectedModelId, messages.length, dispatch]);

    const handleSendMessage = async (messageText: string) => {
        const newChatCopy = newChat ? {...newChat} : null;

        console.log('==> ChatArea-handleSendMessage: newChat: ', newChat);
        console.log('==> ChatArea-handleSendMessage: selectedChatId: ', selectedChatId);
        console.log('==> ChatArea-handleSendMessage: selectedLocalChatId: ', selectedChatLocalId);
        console.log('==> ChatArea-handleSendMessage: contextTransferMode: ', contextTransferMode);

        // Use context transfer if mode is set to conversation
        if (contextTransferMode === 'conversation' && selectedModelId) {
            dispatch(
                sendMessageWithContextTransferThunk({
                    messageText,
                    isNewChat: !selectedChatId,
                    newChat: newChatCopy,
                    contextMessages: messages,
                    targetModelId: selectedModelId,
                })
            );
            // Reset context transfer mode after use
            setContextTransferMode(null);
        } else {
            dispatch(
                sendMessageThunk({
                    messageText,
                    isNewChat: !selectedChatId,
                    newChat: newChatCopy,
                })
            );
        }

        console.log('==> ChatArea-handleSendMessage: setNewChat');
        setNewChat(null);
    };

    const handleLLMChange = (modelId: string, scope: 'next' | 'conversation') => {
        console.log('==> ChatArea-handleLLMChange: modelId, scope: ', modelId, scope);
        // Set context transfer mode for conversation scope
        if (scope === 'conversation') {
            setContextTransferMode('conversation');
        }
    };

    const handleInviteUsers = (userIds: string[]) => {
        console.log('==> ChatArea-handleInviteUsers: userIds: ', userIds);
        // TODO: Implement invite users functionality
        // This would typically call an API to invite users to the chat
        alert(`Inviting ${userIds.length} users to the chat!`);
    };

    return (
        <div className="flex-1 flex flex-col bg-white h-screen">
            {/* Заголовок */}
            <div className="border-b border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {selectedChatName}
                    </h2>
                    <div className="flex items-center space-x-2">
                        {contextTransferMode === 'conversation' && (
                            <div className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 border border-orange-200 rounded-md">
                                Context Transfer Active
                            </div>
                        )}
                        <div className="flex space-x-2">
                            {messages.length > 0 && (
                                <button
                                    onClick={() => setShowLLMSelector(true)}
                                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    Switch LLM
                                </button>
                            )}
                                    <button
                                        onClick={() => setShowInviteModal(true)}
                                        className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                        </svg>
                                        Invite Users
                                    </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Область сообщений */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Compare AI Model Responses
                            </h3>
                            <p className="text-gray-500 max-w-md">
                                Ask a question and get responses from all available models to compare their quality and
                                speed
                            </p>
                            
                            {/* ===== ЗАГЛУШКА ДЛЯ ДЕМОНСТРАЦИИ RESPONSECARD ===== */}
                            {/* Этот блок показывается только когда messages.length === 0 */}
                            {/* Здесь находятся тестовые ResponseCard для демонстрации UI */}
                            <div className="mt-8 max-w-4xl mx-auto">
                                <div className="space-y-4">
                                    {/* Тестовое сообщение пользователя */}
                                    <div className="flex justify-end mb-4">
                                        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-500 text-white">
                                            <p className="text-sm whitespace-pre-wrap">Привет! Как дела?</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-blue-100">
                                                    {new Date().toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Тестовые ответы моделей */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-gray-600">
                                            Model responses:
                                        </h4>
                                        <div className="space-y-3">
                                            {/* ChatGPT Response */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-800 text-lg">ChatGPT-4</h3>
                                                        <div className="flex space-x-2 text-xs">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                                Quality: 95%
                                                            </span>
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                                                Efficiency: 88%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                        Привет! У меня все отлично, спасибо за вопрос! Я готов помочь вам с любыми задачами. Как дела у вас? Чем могу быть полезен?
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-xs text-gray-500">
                                                        1250ms
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-green-500 hover:bg-green-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Claude Response */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-800 text-lg">Claude-3</h3>
                                                        <div className="flex space-x-2 text-xs">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                                Quality: 92%
                                                            </span>
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                                                Efficiency: 91%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                        Здравствуйте! У меня все хорошо, благодарю за интерес. Я функционирую в штатном режиме и готов к работе. Как ваши дела? Есть ли что-то конкретное, с чем я могу помочь?
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-xs text-gray-500">
                                                        980ms
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-green-500 hover:bg-green-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gemini Response */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-800 text-lg">Gemini Pro</h3>
                                                        <div className="flex space-x-2 text-xs">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                                Quality: 89%
                                                            </span>
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                                                Efficiency: 94%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                        Привет! У меня все отлично, спасибо! Я работаю стабильно и готов помочь с любыми вопросами. Как дела? Что планируете делать сегодня?
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-xs text-gray-500">
                                                        750ms
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-green-500 hover:bg-green-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ===== КОНЕЦ ЗАГЛУШКИ ===== */}
                        </div>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={(message.id ? message.id : 'tmp') + (message?.chatLocalId ? message.chatLocalId : '')} className="space-y-4">
                            {/* Сообщение пользователя */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <MessageBubble
                                        message={message}
                                        isUser={message.author === 'user'}
                                    />
                                </div>
                            </div>

                            {/* Ответы моделей */}
                            {message.modelResponses && message.modelResponses.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-600">
                                        Model responses:
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
            <div className="flex-shrink-0">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                    placeholder="Ask a question to compare responses from all models..."
                />
            </div>

            {/* Mid-conversation LLM Selector Modal */}
            {showLLMSelector && (
                <MidConversationLLMSelector
                    messages={messages}
                    onModelChange={handleLLMChange}
                    onClose={() => setShowLLMSelector(false)}
                />
            )}

            {/* Invite Users Modal */}
            {showInviteModal && (
                <InviteUsersModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    onInvite={handleInviteUsers}
                    currentChatId={selectedChatId}
                />
            )}

        </div>
    );
};
