import React from 'react';
import { useAppSelector } from '../store/hooks';
import { LoginScreen } from './LoginScreen';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { FixedChatArea } from './FixedChatArea';
import { authService } from '../services/authService';
import { useGetModelsQuery } from '../services/modelsApi';
import { useGetChatsQuery } from '../services/chatsApi';

export const Renderer: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const selectedChat = useAppSelector((state) => state.chats.selectedChatId);
  const isFixedChatActive = useAppSelector((state) => state.chats.isFixedChatActive);

  // Получаем данные с бэкенда
  const { data: models = [], isLoading: modelsLoading, error: modelsError } = useGetModelsQuery(user?.id || '', {
    skip: !user?.id
  });
  const { data: chats = [], isLoading: chatsLoading, error: chatsError } = useGetChatsQuery(user?.id || '', {
    skip: !user?.id
  });

  // Получаем текущий чат и модель
  const currentChat = chats.find(chat => chat.id === selectedChat) || null;
  const currentModel = currentChat 
    ? models.find(model => model.id === currentChat.modelId) || null
    : null;

  // Если пользователь не авторизован, показываем экран входа
  if (!user) {
    return <LoginScreen onGoogleLogin={authService.signInWithGoogle} />;
  }

  // Показываем загрузку если данные еще загружаются
  if (modelsLoading || chatsLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  // Показываем ошибку если есть проблемы с загрузкой
  if (modelsError || chatsError) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600">Не удалось загрузить данные с сервера</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Боковая панель */}
      <Sidebar />
      
      {/* Основная область чата */}
      <div className="flex-1 flex flex-col">
        {isFixedChatActive ? (
          <FixedChatArea 
            onSendMessage={() => {}} // TODO: Реализовать отправку сообщений
            onLikeResponse={() => {}} // TODO: Реализовать лайки
            onDislikeResponse={() => {}} // TODO: Реализовать дизлайки
          />
        ) : (
          <ChatArea 
            chat={currentChat}
            model={currentModel}
            onSendMessage={(message) => {
              // TODO: Реализовать отправку сообщений через API
              console.log('Sending message:', message);
            }}
          />
        )}
      </div>
    </div>
  );
};
