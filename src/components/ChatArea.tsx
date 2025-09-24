import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectMessages } from '../store/selectors';
import { addChatWithLocalId, updateChatFromLocalId } from '../store/chatSlice';
import { addMessage, updateMessagesChatIdFromLocalId, addChatMessagesIfNotExists } from '../store/messageSlice';
import { useGetChatMessagesQuery, useCreateChatMutation, useSendMessageToModelApiMutation } from '../services';
import { LocalIdGenerator } from '../utils/localIdGenerator';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Loader } from './Loader';
import type { Chat, Model, Message } from '../entities';

interface ChatAreaProps {
  chat: Chat | null;
  model: Model | null;
  onSendMessage: (message: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  model,
  onSendMessage,
}) => {
  const dispatch = useAppDispatch();
  const allMessages = useAppSelector(selectMessages);
  const isLoading = useAppSelector((state) => state.messages.isLoading);
  
  // API хуки
  const [createChat] = useCreateChatMutation();
  const [sendMessageToModel] = useSendMessageToModelApiMutation();
  
  // Состояние для нового чата
  const [newChat, setNewChat] = useState<Chat | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);

  // Определяем текущий чат
  const currentChat = isNewChat ? newChat : chat;
  
  // Получаем сообщения для текущего чата
  const messages = currentChat 
    ? allMessages.filter(msg => {
        // Для нового чата ищем по localId, для существующего по id
        if (isNewChat && newChat) {
          return msg.chatId === newChat.localId;
        }
        return msg.chatId === currentChat.id;
      })
    : [];

  // Проверяем, есть ли в Redux сообщения с реальными ID (не localId) для этого чата
  const hasRealMessages = currentChat?.id && messages.some(msg => 
    msg.chatId === currentChat.id && msg.id && !String(msg.id).startsWith('msg-')
  );


  // Загружаем сообщения для существующего чата только если их нет в Redux
  const { data: chatMessages, isLoading: messagesLoading } = useGetChatMessagesQuery(
    currentChat?.id || '',
    {
      skip: !currentChat?.id || isNewChat || !!hasRealMessages,
    }
  );

  // Создаем новый чат при первом открытии
  useEffect(() => {
    if (model && !isNewChat) {
      // Если чат не выбран (пустая строка) или не существует, создаем новый чат
      if (!chat || chat.id === '') {
        const newChatData: Chat = {
          id: null, // null ID для нового чата
          modelId: model.id,
          localId: LocalIdGenerator.generateLocalId(),
          createdAt: new Date().toISOString(),
        };
        setNewChat(newChatData);
        setIsNewChat(true);
      }
    }
  }, [chat, model, isNewChat]);

  // Обрабатываем переключение чатов
  useEffect(() => {
    if (chat && !isNewChat) {
      // Переключились на существующий чат
      setNewChat(null);
      setIsNewChat(false);
    }
  }, [chat, isNewChat]);

  // Обновляем сообщения в Redux при загрузке
  useEffect(() => {
    if (chatMessages && currentChat && !isNewChat && currentChat.id) {
      // Добавляем только те сообщения, которых еще нет в Redux
      dispatch(addChatMessagesIfNotExists({ 
        chatId: currentChat.id, 
        messages: chatMessages 
      }));
    }
  }, [chatMessages, currentChat, isNewChat, dispatch]);

  // Загружаем сообщения для существующего чата, если они пустые
  useEffect(() => {
    if (currentChat && !isNewChat && currentChat.id && messages.length === 0) {
      // Если чат существует в Redux по id, но сообщения пустые, загружаем их
      // Это происходит автоматически через useGetChatMessagesQuery
    }
  }, [currentChat, isNewChat, messages.length]);

  // Обработка отправки сообщения
  const handleSendMessage = async (messageText: string) => {
    if (!currentChat || !model) return;

    try {
      // Создаем сообщение пользователя
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId: isNewChat ? newChat!.localId : currentChat.id!,
        author: 'user',
        content: messageText,
        createdAt: new Date().toISOString(),
      };

      // Добавляем сообщение пользователя в Redux сразу
      dispatch(addMessage(userMessage));

      let finalChatId = currentChat.id;

      // Если это новый чат, создаем его на бэкенде
      if (isNewChat && newChat) {
        // Создаем чат с LocalId в Redux
        dispatch(addChatWithLocalId(newChat));
        
        // Создаем чат на бэкенде
        const createdChat = await createChat({ modelId: model.id }).unwrap();
        
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
        
        finalChatId = createdChat.id;
        setIsNewChat(false);
      }

      // Отправляем сообщение к модели
      const modelResponse = await sendMessageToModel({
        modelUrl: model.modelUrl,
        chatId: finalChatId!,
        content: messageText,
      }).unwrap();

      // Добавляем ответ модели в Redux
      dispatch(addMessage(modelResponse));

      // Вызываем callback для дополнительной обработки
      onSendMessage(messageText);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  if (!currentChat || !model) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Выберите чат
          </h3>
          <p className="text-gray-500">
            Начните новый разговор с {model?.name || 'моделью'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Заголовок чата */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {model.name}
        </h2>
        <p className="text-sm text-gray-500">
          {isNewChat 
            ? 'Новый чат' 
            : `Чат создан ${new Date(currentChat.createdAt).toLocaleDateString()}`
          }
        </p>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">Начните разговор</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.author === 'user'}
            />
          ))
        )}
        
        {(isLoading || messagesLoading) && (
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
        disabled={isLoading || messagesLoading}
        placeholder={`Сообщение для ${model.name}...`}
      />
    </div>
  );
};
