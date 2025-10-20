
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
    const [isNavigationExpanded, setIsNavigationExpanded] = useState(false);

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

    const handleAdminClick = () => {
        // Navigate to admin dashboard
        window.history.pushState({}, '', '/admin');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleAdminClick: Navigated to admin');
    };

    const handleSubscriptionClick = () => {
        // Navigate to subscription page
        window.history.pushState({}, '', '/subscription');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleSubscriptionClick: Navigated to subscription');
    };

    const handleB2BClick = () => {
        // Navigate to B2B page
        window.history.pushState({}, '', '/b2b');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleB2BClick: Navigated to B2B');
    };

    const handleSSOClick = () => {
        // Navigate to SSO page
        window.history.pushState({}, '', '/sso');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleSSOClick: Navigated to SSO');
    };

    const handleCommunicationClick = () => {
        // Navigate to Communication page
        window.history.pushState({}, '', '/communication');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleCommunicationClick: Navigated to Communication');
    };

    const handleAppStoreClick = () => {
        // Navigate to App Store page
        window.history.pushState({}, '', '/appstore');
        window.dispatchEvent(new PopStateEvent('popstate'));
        console.log('==> Sidebar-handleAppStoreClick: Navigated to App Store');
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Auto-selection mode selector */}
            <div className="p-2 border-b border-gray-200">
                <AutoSelectionModeSelector />
            </div>

            {/* Navigation Toggle */}
            <div className="p-2 border-b border-gray-200">
                <button
                    onClick={() => setIsNavigationExpanded(!isNavigationExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Navigation
                    </div>
                    <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${isNavigationExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Collapsible Navigation Menu */}
            {isNavigationExpanded && (
                <div className="border-b border-gray-200">
                    {/* Analytics button */}
                    <div className="p-2">
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

                    {/* Admin button */}
                    <div className="p-2">
                        <button
                            onClick={handleAdminClick}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admin Panel
                        </button>
                    </div>

                    {/* Subscription button */}
                    <div className="p-2">
                        <button
                            onClick={handleSubscriptionClick}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Subscription
                        </button>
                    </div>

                    {/* B2B Enterprise button */}
                    <div className="p-2">
                        <button
                            onClick={handleB2BClick}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            B2B Enterprise
                        </button>
                    </div>

                    {/* SSO Management button */}
                    <div className="p-2">
                        <button
                            onClick={handleSSOClick}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            SSO Management
                        </button>
                    </div>

                    {/* Communication button */}
                    <div className="p-2">
                        <button
                            onClick={handleCommunicationClick}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Communication
                        </button>
                    </div>

                    {/* App Store button */}
                    <div className="p-2">
                        <button
                            onClick={handleAppStoreClick}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            App Store
                        </button>
                    </div>
                </div>
            )}

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
