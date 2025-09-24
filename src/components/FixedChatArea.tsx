import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectMessagesByChat, selectFixedChatId, selectFixedModels } from '../store/selectors';
import { addMessage, updateMessagesChatIdFromLocalId, addChatMessagesIfNotExists } from '../store/messageSlice';
import { addChatWithLocalId, updateChatFromLocalId } from '../store/chatSlice';
import { useCreateChatMutation, useSendMessageToFixedModelsApiMutation, useGetChatMessagesQuery } from '../services';
import { LocalIdGenerator } from '../utils/localIdGenerator';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ResponseCard } from './ResponseCard';
import { Loader } from './Loader';
import type { Message, Chat } from '../entities';

interface FixedChatAreaProps {
  onSendMessage: (message: string) => void;
  onLikeResponse?: (modelId: string) => void;
  onDislikeResponse?: (modelId: string) => void;
}

export const FixedChatArea: React.FC<FixedChatAreaProps> = ({
  onSendMessage,
  onLikeResponse,
  onDislikeResponse,
}) => {
  const dispatch = useAppDispatch();
  
  // Получаем состояние фиксированного чата
  const fixedChatId = useAppSelector(selectFixedChatId);
  const fixedModels = useAppSelector(selectFixedModels);
  const messages = useAppSelector(selectMessagesByChat);
  
  
  // Состояние для нового чата
  const [newChat, setNewChat] = useState<Chat | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);
  
  // API хуки
  const [createChat] = useCreateChatMutation();
  const [sendMessageToFixedModels] = useSendMessageToFixedModelsApiMutation();
  
  // Проверяем, есть ли в Redux сообщения с реальными ID (не localId) для фиксированного чата
  const hasRealMessages = fixedChatId && messages.some(msg => 
    msg.chatId === fixedChatId && msg.id && !String(msg.id).startsWith('msg-')
  );

  // Загружаем сообщения для фиксированного чата только если их нет в Redux
  const { data: fixedChatMessages, isLoading: fixedMessagesLoading } = useGetChatMessagesQuery(
    fixedChatId || '',
    {
      skip: !fixedChatId || isNewChat || !!hasRealMessages,
    }
  );
  const isLoading = useAppSelector((state) => state.messages.isLoading);
  
  // Определяем текущий чат
  const currentChatId = isNewChat ? newChat?.localId : fixedChatId;
  
  // Создаем новый чат при первом открытии
  useEffect(() => {
    if (fixedModels.length > 0 && !fixedChatId && !isNewChat) {
      // Создаем новый чат для фиксированного режима
      const newChatData: Chat = {
        id: null, // null ID для нового чата
        modelId: fixedModels[0].id, // Используем первую фиксированную модель
        localId: LocalIdGenerator.generateLocalId(),
        createdAt: new Date().toISOString(),
      };
      setNewChat(newChatData);
      setIsNewChat(true);
    }
  }, [fixedModels, fixedChatId, isNewChat]);

  // Обработка переключения чатов
  useEffect(() => {
    if (fixedChatId && !isNewChat) {
      // Переключились на существующий чат
      setNewChat(null);
      setIsNewChat(false);
    }
  }, [fixedChatId, isNewChat]);

  // Загружаем сообщения для существующего чата, если они пустые
  useEffect(() => {
    if (fixedChatId && !isNewChat && messages.length === 0) {
      // Если чат существует в Redux по id, но сообщения пустые, загружаем их
      // Это происходит автоматически через useGetFixedChatMessagesQuery
    }
  }, [fixedChatId, isNewChat, messages.length]);

  // Обновляем сообщения в Redux при загрузке
  useEffect(() => {
    if (fixedChatMessages && fixedChatId && !isNewChat) {
      // Добавляем только те сообщения, которых еще нет в Redux
      dispatch(addChatMessagesIfNotExists({ 
        chatId: fixedChatId, 
        messages: fixedChatMessages 
      }));
    }
  }, [fixedChatMessages, fixedChatId, isNewChat, dispatch]);

  // Обработка отправки сообщения ко всем моделям
  const handleSendMessage = async (messageText: string) => {
    if (!currentChatId || fixedModels.length === 0) return;

    try {
      // Создаем сообщение пользователя
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId: currentChatId,
        author: 'user',
        content: messageText,
        createdAt: new Date().toISOString(),
      };

      // Добавляем сообщение пользователя в Redux сразу
      dispatch(addMessage(userMessage));

      let finalChatId = currentChatId;

      // Если это новый чат, создаем его на бэкенде
      if (isNewChat && newChat) {
        // Создаем чат с LocalId в Redux
        dispatch(addChatWithLocalId(newChat));
        
        // Создаем чат на бэкенде
        const createdChat = await createChat({ modelId: fixedModels[0].id }).unwrap();
        
        // Обновляем чат в Redux с реальным id
        dispatch(updateChatFromLocalId({ 
          localId: newChat.localId, 
          chat: createdChat 
        }));
        
        // Обновляем chatId для всех сообщений этого чата
        dispatch(updateMessagesChatIdFromLocalId({ 
          localId: newChat.localId, 
          newChatId: createdChat.id || '' 
        }));
        
        finalChatId = createdChat.id || '';
        setIsNewChat(false);
      }

      // Отправляем сообщение к фиксированным моделям (используем специальный endpoint)
      try {
        const response = await sendMessageToFixedModels({
          modelUrl: fixedModels[0].modelUrl, // Используем URL первой модели
          chatId: finalChatId,
          content: messageText,
        }).unwrap();

        // Добавляем ответ с modelResponses в Redux
        dispatch(addMessage(response));

      } catch (error) {
        console.error('Error sending message to fixed models:', error);
        
        // В случае ошибки создаем сообщение с ошибками для каждой модели
        const errorMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          chatId: finalChatId,
          author: 'model',
          content: '',
          createdAt: new Date().toISOString(),
          modelResponses: fixedModels.map((model) => ({
            id: `error-${Date.now()}-${model.id}`,
            messageId: `msg-${Date.now() + 1}`,
            modelName: model.name,
            content: 'Ошибка при получении ответа',
            responseTime: 0,
            createdAt: new Date().toISOString(),
          })),
        };

        dispatch(addMessage(errorMessage));
      }

      // Вызываем callback для дополнительной обработки
      onSendMessage(messageText);
    } catch (error) {
      console.error('Error sending message to all models:', error);
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
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Сравните ответы AI-моделей
              </h3>
              <p className="text-gray-500 max-w-md">
                Задайте вопрос и получите ответы от всех доступных моделей для сравнения их качества и скорости
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
                        onLike={onLikeResponse}
                        onDislike={onDislikeResponse}
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
              <Loader size="sm" />
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
