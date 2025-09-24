import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Renderer } from './components';
import { authService } from './services/authService';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loginSuccess, logout } from './store/userSlice';
import { selectFixedChat } from './store/chatSlice';

// Компонент приложения с логикой авторизации
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  // Инициализация приложения
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инициализируем Google Auth
        await authService.initializeGoogleAuth();

        // Проверяем, есть ли сохраненная авторизация
        if (authService.isAuthenticated()) {
          const savedUser = authService.getCurrentUser();
          if (savedUser) {
            dispatch(loginSuccess(savedUser));
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();

    // Слушаем события авторизации
    const handleAuthSuccess = (event: CustomEvent) => {
      dispatch(loginSuccess(event.detail));
    };

    const handleAuthError = (event: CustomEvent) => {
      console.error('Auth error:', event.detail);
    };

    const handleAuthLogout = () => {
      dispatch(logout());
    };

    window.addEventListener('authSuccess', handleAuthSuccess as EventListener);
    window.addEventListener('authError', handleAuthError as EventListener);
    window.addEventListener('authLogout', handleAuthLogout);

    return () => {
      window.removeEventListener('authSuccess', handleAuthSuccess as EventListener);
      window.removeEventListener('authError', handleAuthError as EventListener);
      window.removeEventListener('authLogout', handleAuthLogout);
    };
  }, [dispatch]);


  // Автоматически выбираем фиксированный чат при первом входе
  useEffect(() => {
    if (user && !isLoading) {
      // Проверяем, есть ли уже выбранный чат
      const currentSelectedChatId = store.getState().chats.selectedChatId;
      const currentIsFixedChatActive = store.getState().chats.isFixedChatActive;
      
      // Если ничего не выбрано, выбираем фиксированный чат
      if (!currentSelectedChatId && !currentIsFixedChatActive) {
        dispatch(selectFixedChat(null));
      }
    }
  }, [user, isLoading, dispatch]);

  return <Renderer />;
};

// Главный компонент приложения с Redux Provider
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App
