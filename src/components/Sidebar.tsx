import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectSelectedChatId,
  selectIsFixedChatActive,
  selectFixedChatId,
} from '../store/selectors';
import { selectChat, selectFixedChat } from '../store/chatSlice';
import { SidebarModelItem } from './SidebarModelItem';
import { useGetModelsQuery } from '../services/modelsApi';
import { useGetChatsQuery } from '../services/chatsApi';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  
  // Получаем данные с бэкенда
  const { data: models = [], isLoading: modelsLoading } = useGetModelsQuery(user?.id || '', {
    skip: !user?.id
  });
  const { data: chats = [], isLoading: chatsLoading } = useGetChatsQuery(user?.id || '', {
    skip: !user?.id
  });
  
  // Разделяем модели на фиксированные и обычные
  const fixedModels = models.filter(model => model.isFixed);
  const regularModels = models.filter(model => !model.isFixed);
  
  // Группируем чаты по моделям
  const chatsByModel = chats.reduce((acc, chat) => {
    if (!acc[chat.modelId]) {
      acc[chat.modelId] = [];
    }
    acc[chat.modelId].push(chat);
    return acc;
  }, {} as Record<string, typeof chats>);
  
  // Получаем чаты фиксированной модели
  const fixedModelChats = fixedModels.length > 0 
    ? chats.filter(chat => chat.modelId === fixedModels[0].id)
    : [];
  
  // Состояние выбора
  const activeChatId = useAppSelector(selectSelectedChatId);
  const isFixedChatActive = useAppSelector(selectIsFixedChatActive);
  const fixedChatId = useAppSelector(selectFixedChatId);
  
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const handleToggleModel = (modelId: string) => {
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(modelId)) {
      newExpanded.delete(modelId);
    } else {
      newExpanded.add(modelId);
    }
    setExpandedModels(newExpanded);
  };

  const handleChatSelect = (chatId: string) => {
    dispatch(selectChat(chatId));
  };

  const handleNewChat = (modelId: string) => {
    // Если у модели есть чаты, выбираем первый
    const modelChats = chatsByModel[modelId] || [];
    if (modelChats.length > 0) {
      dispatch(selectChat(modelChats[0].id || ''));
    } else {
      // Если чатов нет, создаем пустой чат (будет обработан в ChatArea)
      dispatch(selectChat(''));
    }
  };

  const handleFixedChatSelect = (chatId: string) => {
    dispatch(selectFixedChat(chatId));
  };

  const handleChatDelete = (chatId: string) => {
    // TODO: Реализовать удаление чата
    console.log('Delete chat:', chatId);
  };

  const handleFixedChatClick = () => {
    // Если уже выбран фиксированный чат, переключаемся на новый
    if (isFixedChatActive) {
      dispatch(selectFixedChat(null)); // Создаем новый чат
    } else {
      dispatch(selectFixedChat(null)); // Создаем новый чат
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">LLMGator</h1>
        {/* Индикатор тестового режима */}
        <div className="mt-2 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-500">Тестовый режим</span>
        </div>
      </div>

              {/* Фиксированный чат - рендерим только если есть фиксированные модели */}
              {fixedModels.length > 0 && (
                <div className="p-2">
                  <div
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      isFixedChatActive
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={handleFixedChatClick}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-medium">Спросить ИИ</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewChat(fixedModels[0].id);
                        }}
                        className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Новый чат"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Список чатов фиксированной модели */}
                  {isFixedChatActive && fixedModelChats.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1">
                      {fixedModelChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            chat.id === fixedChatId
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => handleFixedChatSelect(chat.id || '')}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {chat.localId}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChatDelete(chat.id || '');
                            }}
                            className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Удалить чат"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

      {/* Разделитель */}
      <div className="border-t border-gray-200 my-2" />

      {/* Обычные модели и чаты */}
      <div className="flex-1 overflow-y-auto p-2">
        {regularModels.map((model) => (
          <SidebarModelItem
            key={model.id}
            model={model}
            chats={chatsByModel[model.id] || []}
            isExpanded={expandedModels.has(model.id)}
            onToggle={handleToggleModel}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onChatDelete={handleChatDelete}
            activeChatId={activeChatId || undefined}
          />
        ))}
        
        {/* Показываем сообщение если нет моделей */}
        {regularModels.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm">Нет доступных моделей</p>
          </div>
        )}
      </div>
    </div>
  );
};
