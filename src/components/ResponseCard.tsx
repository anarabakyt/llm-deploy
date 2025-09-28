import React, {useState} from 'react';
import {useAppDispatch} from '../config/hooks.ts';
import type {ModelResponse} from '../entities';

interface ResponseCardProps {
    response: ModelResponse;
    messageId: string;
    onLike?: (modelId: string) => void;
    onDislike?: (modelId: string) => void;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
                                                              response,
                                                              messageId,
                                                              onLike,
                                                              onDislike,
                                                          }) => {
    const dispatch = useAppDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    // Функция для получения превью (первые 5 строк)
    const getPreview = (content: string): string => {
        const lines = content.split('\n');
        return lines.slice(0, 5).join('\n');
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Предотвращаем разворачивание карточки
        try {
            // todo реализация лайка
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleDislike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Предотвращаем разворачивание карточки
        try {
            // todo реализация дизлайка
            setIsDisliked(!isDisliked);
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={toggleExpanded}
        >
            {/* Заголовок с именем модели */}
            <div className="mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{response.modelName}</h3>
            </div>

            {/* Контент ответа */}
            <div className="mb-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {isExpanded ? response.content : getPreview(response.content)}
                </p>
                {!isExpanded && response.content.split('\n').length > 5 && (
                    <div className="mt-2">
            <span className="text-blue-500 text-sm font-medium">
              Нажмите, чтобы развернуть...
            </span>
                    </div>
                )}
                {isExpanded && response.content.split('\n').length > 5 && (
                    <div className="mt-2">
            <span className="text-blue-500 text-sm font-medium">
              Нажмите, чтобы свернуть...
            </span>
                    </div>
                )}
            </div>

            {/* Нижняя панель с временем и кнопками */}
            <div className="flex justify-between items-center">
                {/* Время отклика */}
                <div className="text-xs text-gray-500">
                    {response.responseTime}ms
                </div>

                {/* Кнопки лайков */}
                <div className="flex space-x-2">
                    <button
                        onClick={handleLike}
                        className={`p-2 rounded-full transition-colors ${
                            isLiked
                                ? 'text-green-500 bg-green-50 hover:bg-green-100'
                                : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                        }`}
                        title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleDislike}
                        className={`p-2 rounded-full transition-colors ${
                            isDisliked
                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title={isDisliked ? 'Убрать дизлайк' : 'Поставить дизлайк'}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
