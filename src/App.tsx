import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store} from './config/store.ts';
import {Renderer} from './components';
import {LoggingDashboard} from './components/LoggingDashboard';
import {AdminDashboard} from './components/admin';
import {useAppDispatch, useAppSelector} from './config/hooks.ts';
import {loginFailure, logout, setUser} from './store/slice/userSlice.ts';
import {authService} from "./services/authService.ts";

// Компонент приложения с логикой авторизации
const AppContent: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);
    const isLoading = useAppSelector((state) => state.user.isLoading);
    const [currentView, setCurrentView] = useState<'chat' | 'analytics' | 'admin'>('chat');

    const handleViewChange = (view: 'chat' | 'analytics' | 'admin') => {
        setCurrentView(view);
    };

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

    // Listen for URL changes to update currentView
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            if (path === '/analytics') {
                setCurrentView('analytics');
            } else if (path === '/admin') {
                setCurrentView('admin');
            } else {
                setCurrentView('chat');
            }
        };

        // Check initial URL
        handlePopState();

        // Listen for URL changes
        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // todo можно открывать новый чат при старте
    useEffect(() => {
        if (user && !isLoading) {
            // Проверяем, есть ли уже выбранный чат
            const currentSelectedChatId = store.getState().chats.selectedChatId;
        }
    }, [user, isLoading, dispatch]);

    if (currentView === 'analytics') {
        return (
            <div className="h-screen flex">
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <button
                            onClick={() => handleViewChange('chat')}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Chat
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <LoggingDashboard />
                </div>
            </div>
        );
    }

    if (currentView === 'admin') {
        return (
            <div className="h-screen flex">
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <button
                            onClick={() => handleViewChange('chat')}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Chat
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <AdminDashboard />
                </div>
            </div>
        );
    }

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
