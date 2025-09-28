import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../config/hooks.ts';
import {LoginScreen} from './LoginScreen';
import {Sidebar} from './Sidebar';
import {ChatArea} from './ChatArea.tsx';
import {useGetChatsQuery, useGetModelsQuery} from '../services/rtk';
import type {Chat, Model} from "../entities";
import {setModels} from "../store/slice/modelSlice.ts";
import {setChats} from "../store/slice/chatSlice.ts";
import {authService} from "../services/authService.ts";

export const Renderer: React.FC = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.currentUser);
    const selectedChatId = useAppSelector((state) => state.chats.selectedChatId);

    // Если пользователь не авторизован, показываем экран входа
    if (!user) {
        return <LoginScreen onGoogleLogin={authService.signInWithGoogle}/>;
    }

    const {data: modelsData = [], isLoading: modelsLoading, error: modelsError} = useGetModelsQuery(user?.id || '', {
        skip: !user?.id
    });
    const models: Model[] = modelsData ?? [];

    useEffect(() => {
        if (modelsData) {
            dispatch(setModels(modelsData));
        }
    }, [modelsData, dispatch]);

    const {data: chatsData = [], isLoading: chatsLoading, error: chatsError} = useGetChatsQuery(user?.id || '', {
        skip: !user?.id
    });
    const chats: Chat[] = chatsData ?? [];

    useEffect(() => {
        if (chatsData) {
            dispatch(setChats(chatsData));
        }
    }, [chatsData, dispatch]);

    // Получаем текущий чат и модель
    const currentChat = chats.find(chat => chat.id === selectedChatId) || null;
    const currentModel = currentChat
        ? models.find(model => model.id === currentChat.modelId) || null
        : null;

    // todo сделать нормальный лоудер
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
    // todo заменить показ ошибки на нотификацию, но чтобы приложение работало дальше
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
            <Sidebar/>

            {/* Основная область чата */}
            <div className="flex-1 flex flex-col">
                <ChatArea/>
            </div>
        </div>
    );
};
