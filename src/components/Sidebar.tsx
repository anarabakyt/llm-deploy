
import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../config/hooks.ts';
import {selectChats, selectMessagesByChat, selectModels, selectSelectedChatId} from '../store/selector/selectors.ts';
import {setSelectedChatId, setSelectedChatLocalId} from '../store/slice/chatSlice.ts';
import {SidebarModelItem} from './SidebarModelItem';
import {AutoSelectionModeSelector} from './AutoSelectionModeSelector';
import {setSelectedModelId} from "../store/slice/modelSlice.ts";
import {MessageService} from "../services/messageService.ts";
import {setChatMessages} from "../store/slice/messageSlice.ts";
import type {Message} from "../entities";

export const Sidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const models = useAppSelector(selectModels);
    const chats = useAppSelector(selectChats);
    const activeChatId = useAppSelector(selectSelectedChatId);
    const messages = useAppSelector(selectMessagesByChat);

    const fetchMessages = (oldMessages: Message[]) => {
        if (activeChatId && oldMessages.length === 0) {
            console.log('==> Sidebar-fetchMessages: activeChatId: ', activeChatId);
            console.log('==> Sidebar-fetchMessages: messages.length: ', oldMessages.length);
            MessageService.getChatMessages(activeChatId)
                .then((fetchedMessages) => {
                    dispatch(setChatMessages({ chatId: activeChatId, messages: fetchedMessages }));
                });
        }
    }

    fetchMessages(messages);

    // Группируем чаты по моделям
    const chatsByModel = chats.reduce((acc, chat) => {
        if (!chat.modelId) {
            return acc;
        }

        if (!acc[chat.modelId]) {
            acc[chat.modelId] = [];
        }
        acc[chat.modelId].push(chat);
        return acc;
    }, {} as Record<string, typeof chats>);

    const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

    const handleToggleModel = (modelId: string) => {
        const newExpandedModelsSet = new Set(expandedModels);
        if (newExpandedModelsSet.has(modelId)) {
            newExpandedModelsSet.delete(modelId);
        } else {
            newExpandedModelsSet.add(modelId);
        }
        setExpandedModels(newExpandedModelsSet);
    };

    const handleChatSelect = (modelId: string, chatId: string | null, localId: string | null) => {
        console.log('==> Sidebar-handleChatSelect: modelId, chatId, localId: ', modelId, chatId, localId);
        dispatch(setSelectedChatId(chatId));
        dispatch(setSelectedChatLocalId(localId));
        dispatch(setSelectedModelId(modelId));
        console.log('==> messages length: ', messages.length);
    };

    const handleNewChat = (modelId: string) => {
        console.log('==> Sidebar-handleNewChat: modelId: ', modelId);
        dispatch(setSelectedModelId(modelId));
        dispatch(setSelectedChatId(null));
        dispatch(setSelectedChatLocalId(null));
    };

    const handleAnalyticsClick = () => {
        // Navigate to analytics dashboard
        window.history.pushState({}, '', '/analytics');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleAnalyticsClick: Navigated to analytics');
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Auto-selection mode selector */}
            <div className="p-2 border-b border-gray-200">
                <AutoSelectionModeSelector />
            </div>

            {/* Analytics button */}
            <div className="p-2 border-b border-gray-200">
                <button
                    onClick={handleAnalyticsClick}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    LLM Analytics
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {models.map((model) => (
                    <SidebarModelItem
                        key={model.id}
                        model={model}
                        chats={chatsByModel[model.id] || []}
                        isExpanded={expandedModels.has(model.id)}
                        onToggle={handleToggleModel}
                        onChatSelect={handleChatSelect}
                        onNewChat={handleNewChat}
                        activeChatId={activeChatId || undefined}
                    />
                ))}

                {/* Показываем сообщение если нет моделей */}
                {models.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <p className="text-sm">No available models</p>
                    </div>
                )}
            </div>
        </div>
    );
};
