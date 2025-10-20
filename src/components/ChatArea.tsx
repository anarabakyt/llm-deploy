import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../config/hooks.ts';
import {
    selectMessagesByChat,
    selectMessagesLoading,
    selectSelectedChatId,
    selectSelectedChatLocalId,
    selectSelectedChatName,
    selectSelectedModelId
} from '../store/selector/selectors.ts';
import { LocalIdGenerator } from '../utils';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ResponseCard } from './ResponseCard';
import { Loader } from './Loader';
import { MidConversationLLMSelector } from './MidConversationLLMSelector';
import { InviteUsersModal } from './InviteUsersModal';
import { ContextAwareLLMSelector } from './ContextAwareLLMSelector';
import { ContextModeToggle } from './ContextModeToggle';
import { TokenUsageIndicator } from './TokenUsageIndicator';
import type { Chat } from '../entities';
import { setSelectedChatLocalId } from "../store/slice/chatSlice.ts";
import { sendMessageThunk, sendMessageWithContextTransferThunk } from "../store/thunk/messageThunks.ts";
import { useAppSelector as useSelector } from '../config/hooks.ts';
import { setSelectionMode, setCustomSelectedModelIds } from '../store/slice/modelSlice.ts';
import { selectModels } from '../store/selector/selectors.ts';

export const ChatArea: React.FC = () => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(selectMessagesByChat);
    const selectedChatId = useAppSelector(selectSelectedChatId);
    const selectedChatLocalId = useAppSelector(selectSelectedChatLocalId);
    const selectedChatName = useAppSelector(selectSelectedChatName);
    const selectedModelId = useAppSelector(selectSelectedModelId);
    const isLoading = useAppSelector(selectMessagesLoading);
    const models = useAppSelector(selectModels);
    const selectionMode = useSelector((s) => s.models.selectionMode);
    const customSelectedModelIds = useSelector((s) => s.models.customSelectedModelIds);

    const [newChat, setNewChat] = useState<Chat | null>(null);
    const [showLLMSelector, setShowLLMSelector] = useState(false);
    const [contextTransferMode, setContextTransferMode] = useState<'next' | 'conversation' | null>(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showContextSelector, setShowContextSelector] = useState(false);
  const [showLLMMenu, setShowLLMMenu] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [hasChosenMode, setHasChosenMode] = useState(false);
  const [showMoreModels, setShowMoreModels] = useState(false);

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
        const newChatCopy = newChat ? { ...newChat } : null;

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

    const handleFileAttach = (file: File) => {
        console.log('==> ChatArea-handleFileAttach: file: ', file.name, file.size);
        // TODO: Implement file processing logic
        // For now, just log the file info
        alert(`File attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    };

    // LLM selection handlers
    const handleSelectionModeChange = (mode: 'best' | 'green' | 'custom') => {
        setHasChosenMode(true);
        dispatch(setSelectionMode(mode));
    };
    const handleToggleCustomModel = (modelId: string) => {
        const set = new Set(customSelectedModelIds);
        if (set.has(modelId)) set.delete(modelId); else set.add(modelId);
        dispatch(setCustomSelectedModelIds(Array.from(set)));
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

    const handleContextModelSwitch = (modelId: string, mode: 'next-only' | 'entire-conversation') => {
        console.log('Context model switch:', { modelId, mode });
        // TODO: Implement context-aware model switching
        setShowContextSelector(false);
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
                    <div className="w-full">
                        {/* Header section */}
                        <div className="text-center mb-8">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Compare AI Model Responses
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Ask a question and get responses from all available models to compare their quality and
                                speed
                            </p>
                        </div>

                        {/* ===== ЗАГЛУШКА ДЛЯ ДЕМОНСТРАЦИИ RESPONSECARD ===== */}
                        {/* Этот блок показывается только когда messages.length === 0 */}
                        {/* Здесь находятся тестовые ResponseCard для демонстрации UI */}
                        <div className="max-w-6xl mx-auto px-4">
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
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                                                Tokens: 156  {/* ← HERE IS THE 128 TOKENS */}
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
                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
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
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                                                Tokens: 142  {/* ← HERE IS THE 128 TOKENS */}
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
                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
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
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                                                Tokens: 128  {/* ← HERE IS THE 128 TOKENS */}
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
                                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                            </svg>
                                                        </button>
                                                        <button className="p-2 rounded-full transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Сводка по токенам */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Token Summary:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">2,456</div>
                                                <div className="text-gray-600">Total Tokens</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">426</div>
                                                <div className="text-gray-600">Average per Response</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">78%</div>
                                                <div className="text-gray-600">Context Usage</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>User: 12 tokens</span>
                                                <span>GPT-4: 156 tokens</span>
                                                <span>Claude-3: 142 tokens</span>
                                                <span>Gemini: 128 tokens</span>  {/* ← HERE IS THE 128 TOKENS */}
                                                <span>System: 2,018 tokens</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===== CONTEXT-AWARE LLM SELECTION MOCK ===== */}
                            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Context-Aware LLM Selection Demo
                                </h3>

                                {/* Context Mode Toggle Mock */}
                                <div className="mb-4">
                                    <ContextModeToggle
                                        mode="entire-conversation"
                                        onModeChange={() => { }}
                                        tokenCount={1247}
                                        estimatedCost={0.0025}
                                        messageCount={3}
                                    />
                                </div>

                                {/* Token Usage Indicator Mock */}
                                <div className="mb-4">
                                    <TokenUsageIndicator
                                        tokenCount={1247}
                                        estimatedCost={0.0025}
                                        messageCount={3}
                                        mode="entire-conversation"
                                        className="justify-center"
                                    />
                                </div>

                                {/* Mock Context Information */}
                                <div className="space-y-3">
                                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Context Information:</h4>
                                        <div className="space-y-2 text-xs text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Previous messages:</span>
                                                <span className="font-medium">3</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Total tokens:</span>
                                                <span className="font-medium">1,247</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Estimated cost:</span>
                                                <span className="font-medium text-green-600">$0.0025</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Context mode:</span>
                                                <span className="font-medium text-orange-600">Full conversation</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock LLM Switch Button */}
                                    <button
                                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                        onClick={() => setShowContextSelector(true)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        <span>Switch LLM with Context</span>
                                    </button>
                                </div>
                            </div>
                            {/* ===== КОНЕЦ ЗАГЛУШКИ ===== */}
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
                <div className="relative">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        onFileAttach={handleFileAttach}
                        disabled={isLoading}
                        placeholder="Ask a question to compare responses from all models..."
                    />
                    {/* Compact dropdown positioned bottom-right over input area */}
                    <div className="absolute bottom-6 right-16">
                        <div className="relative inline-block">
                            <button
                                onClick={() => setShowModelDropdown(!showModelDropdown)}
                                className="inline-flex items-center px-3 py-2 rounded-md bg-white text-sm text-gray-700 hover:bg-[#e8eaed] border border-transparent hover:border-transparent focus:border-transparent active:border-transparent focus:outline-none focus:ring-0"
                                aria-expanded={showModelDropdown}
                            >
                                <span className="mr-2">
                                    {!hasChosenMode && 'Pick LLM'}
                                    {hasChosenMode && selectionMode==='best' && 'Best'}
                                    {hasChosenMode && selectionMode==='green' && 'Green'}
                                    {hasChosenMode && selectionMode==='custom' && (
                                        customSelectedModelIds.length > 0 
                                            ? customSelectedModelIds.map(id => {
                                                if (id === 'claude-3') return 'Claude';
                                                if (id === 'perplexity') return 'Perplexity';
                                                // For dynamic models, try to get the name
                                                const model = models.find(m => m.id === id);
                                                return model?.name || id;
                                            }).join(', ')
                                            : 'Selected'
                                    )}
                                </span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            {showModelDropdown && (
                                <div className="absolute right-0 bottom-full mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    {/* Best */}
                                    <button
                                        onClick={() => { if (!((selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='green'))) { handleSelectionModeChange('best'); setShowModelDropdown(false); } }}
                                        disabled={(selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='green')}
                                        className={`w-full text-left px-4 py-3 ${((selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='green')) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e8eaed]'} ${hasChosenMode && selectionMode==='best' ? 'bg-blue-50' : ''}`}
                                        aria-disabled={(selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='green')}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Best</div>
                                                <div className="text-xs text-gray-500">Smartest for everyday tasks</div>
                                            </div>
                                            {hasChosenMode && selectionMode==='best' && (
                                                <svg className="w-5 h-5 text-blue-600 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                            )}
                                        </div>
                                    </button>
                                    {/* Green */}
                                    <button
                                        onClick={() => { if (!((selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='best'))) { handleSelectionModeChange('green'); setShowModelDropdown(false); } }}
                                        disabled={(selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='best')}
                                        className={`w-full text-left px-4 py-3 ${((selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='best')) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e8eaed]'} ${hasChosenMode && selectionMode==='green' ? 'bg-green-50' : ''}`}
                                        aria-disabled={(selectionMode==='custom' && customSelectedModelIds.length>0) || (hasChosenMode && selectionMode==='best')}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Green</div>
                                                <div className="text-xs text-gray-500">Fastest for quick answers</div>
                                            </div>
                                            {hasChosenMode && selectionMode==='green' && (
                                                <svg className="w-5 h-5 text-green-600 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                            )}
                                        </div>
                                    </button>
                                    <div className="border-t border-gray-200"/>
                                    {/* More models row with hover submenu */}
                                    <div
                                        className={`relative w-full text-left px-4 py-3 ${((hasChosenMode && selectionMode==='best') || (hasChosenMode && selectionMode==='green')) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e8eaed]'}`}
                                        onMouseEnter={() => { 
                                            console.log('More models hover enter'); 
                                            if (!((hasChosenMode && selectionMode==='best') || (hasChosenMode && selectionMode==='green'))) {
                                                setShowMoreModels(true);
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            console.log('More models hover leave');
                                            setShowMoreModels(false);
                                        }}
                                        onClick={() => { 
                                            // Don't change selection mode on click, just show submenu
                                            console.log('More models clicked');
                                        }}
                                        aria-disabled={(hasChosenMode && selectionMode==='best') || (hasChosenMode && selectionMode==='green')}
                                        role="button"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">More models</div>
                                                <div className="text-xs text-gray-500">Choose specific LLMs</div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {(selectionMode==='custom' && customSelectedModelIds.length>0) && (
                                                    <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                                )}
                                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                            </div>
                                        </div>

                                        {showMoreModels && !((hasChosenMode && selectionMode==='best') || (hasChosenMode && selectionMode==='green')) && (
                                            <div className="absolute right-full bottom-0 mr-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-2"
                                                 onMouseEnter={() => {
                                                     console.log('Submenu hover enter');
                                                     setShowMoreModels(true);
                                                 }}
                                                 onMouseLeave={() => {
                                                     console.log('Submenu hover leave');
                                                     setShowMoreModels(false);
                                                 }}>
                                                {/* Debug: Show all models */}
                                                <div className="text-xs text-gray-400 mb-2">Available models: {models.length}</div>
                                                
                                                {/* All models checkbox */}
                                                <label className="flex items-center justify-between text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-[#e8eaed] border-b border-gray-200">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={customSelectedModelIds.length > 0 && customSelectedModelIds.length === (models.length + 2)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                if (selectionMode !== 'custom') handleSelectionModeChange('custom');
                                                                if (e.target.checked) {
                                                                    // Select all models
                                                                    const allModelIds = ['claude-3', 'perplexity', ...models.map(m => m.id)];
                                                                    dispatch(setCustomSelectedModelIds(allModelIds));
                                                                } else {
                                                                    // Deselect all
                                                                    dispatch(setCustomSelectedModelIds([]));
                                                                }
                                                                setShowModelDropdown(false);
                                                            }}
                                                        />
                                                        <span className="font-medium">All</span>
                                                    </div>
                                                </label>
                                                
                                                {/* Hardcoded Claude and Perplexity for testing */}
                                                <label className="flex items-center justify-between text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-[#e8eaed]">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={customSelectedModelIds.includes('claude-3')}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                if (selectionMode !== 'custom') handleSelectionModeChange('custom');
                                                                handleToggleCustomModel('claude-3');
                                                                setShowModelDropdown(false);
                                                            }}
                                                        />
                                                        <span>Claude-3</span>
                                                    </div>
                                                </label>
                                                
                                                <label className="flex items-center justify-between text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-[#e8eaed]">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            checked={customSelectedModelIds.includes('perplexity')}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                if (selectionMode !== 'custom') handleSelectionModeChange('custom');
                                                                handleToggleCustomModel('perplexity');
                                                                setShowModelDropdown(false);
                                                            }}
                                                        />
                                                        <span>Perplexity</span>
                                                    </div>
                                                </label>
                                                
                                                {/* Dynamic models from API */}
                                                {models.filter(m => {
                                                    const label = String(m?.name ?? m?.id ?? '').toLowerCase();
                                                    return label.includes('claude') || label.includes('perplexity');
                                                }).map((m) => (
                                                    <label key={m.id} className="flex items-center justify-between text-sm text-gray-700 rounded-md px-2 py-2 hover:bg-[#e8eaed]">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded"
                                                                checked={customSelectedModelIds.includes(m.id)}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    if (selectionMode !== 'custom') handleSelectionModeChange('custom');
                                                                    handleToggleCustomModel(m.id);
                                                                    setShowModelDropdown(false);
                                                                }}
                                                            />
                                                            <span>{m?.name || m?.id || 'Unknown model'}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                                {customSelectedModelIds.length===0 && (
                                                    <div className="mt-1 text-xs text-gray-500 px-2 py-1">Select at least one LLM.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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

            {/* Context-Aware LLM Selector Modal */}
            <ContextAwareLLMSelector
                currentPrompt="Привет! Как дела?"
                onModelSwitch={handleContextModelSwitch}
                isVisible={showContextSelector}
                onClose={() => setShowContextSelector(false)}
            />

        </div>
    );
};
