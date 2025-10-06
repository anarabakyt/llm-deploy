import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './config/store.ts';
import {Renderer} from './components';
import {useAppDispatch, useAppSelector} from './config/hooks.ts';
import {loginFailure, logout, setUser} from './store/slice/userSlice.ts';
import {authService} from "./services/authService.ts";

// Компонент приложения с логикой авторизации
const AppContent: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);
    const isLoading = useAppSelector((state) => state.user.isLoading);

    // Инициализация приложения
    useEffect(() => {
        const initializeApp = async () => {
            try {
                await authService.initialize();

                if (authService.hasStoredUser()) {
                    const savedUser = authService.getCurrentUser();
                    if (savedUser) {
                        dispatch(setUser(savedUser));
                    }
                }
            } catch (error) {
                console.error('Failed to initialize app:', error);
            }
        };

        initializeApp();

        // Слушаем события авторизации
        const handleAuthSuccess = (event: CustomEvent) => {
            dispatch(setUser(event.detail));
        };

        const handleAuthError = (event: CustomEvent) => {
            dispatch(loginFailure('Auth error:' + event.detail));
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

    // todo можно открывать новый чат при старте
    useEffect(() => {
        if (user && !isLoading) {
            // Проверяем, есть ли уже выбранный чат
            const currentSelectedChatId = store.getState().chats.selectedChatId;
        }
    }, [user, isLoading, dispatch]);

    return <Renderer/>;
};

// Главный компонент приложения с Redux Provider
function App() {
    return (
        <Provider store={store}>
            <AppContent/>
        </Provider>
    );
}

export default App
