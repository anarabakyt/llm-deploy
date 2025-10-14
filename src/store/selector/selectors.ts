import {createSelector} from '@reduxjs/toolkit';
import type {RootState} from '../../config/store.ts';

export const selectUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export const selectModels = (state: RootState) => state.models.models;
export const selectSelectedModelId = (state: RootState) => state.models.selectedModelId;
export const selectSelectedModelUrl = (state: RootState) => state.models.selectedModelUrl;
export const selectModelsLoading = (state: RootState) => state.models.isLoading;
export const selectModelsError = (state: RootState) => state.models.error;

export const selectChats = (state: RootState) => state.chats.chats;
export const selectSelectedChatId = (state: RootState) => state.chats.selectedChatId;
export const selectSelectedChatLocalId = (state: RootState) => state.chats.selectedChatLocalId;
export const selectChatsLoading = (state: RootState) => state.chats.isLoading;
export const selectChatsError = (state: RootState) => state.chats.error;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesLoading = (state: RootState) => state.messages.isLoading;
export const selectMessagesError = (state: RootState) => state.messages.error;
// Селекторы для логирования
export const selectLogs = (state: RootState) => state.logging.logs;
export const selectLoggingMetrics = (state: RootState) => state.logging.metrics;
export const selectLoggingLoading = (state: RootState) => state.logging.isLoading;
export const selectLoggingError = (state: RootState) => state.logging.error;
export const selectSelectedLogId = (state: RootState) => state.logging.selectedLogId;
export const selectFilterByModel = (state: RootState) => state.logging.filterByModel;
export const selectFilterByDateRange = (state: RootState) => state.logging.filterByDateRange;


export const selectSelectedChatName = createSelector(
    [selectChats, selectSelectedChatId, selectSelectedChatLocalId],
    (chats, selectedChatId, selectedChatLocalId) => {
        if (selectedChatId) {
            return chats.find(chat => chat.id === selectedChatId)?.name || 'Ask AI';
        } else if (selectedChatLocalId) {
            return chats.find(chat => chat.id === selectedChatLocalId)?.name || 'Ask AI';
        }
        return 'Ask AI';
    }
);

export const selectMessagesByChat = createSelector(
    [selectMessages, selectSelectedChatId, selectSelectedChatLocalId],
    (messages, selectedChatId, selectedChatLocalId) => {
        if (selectedChatId) {
            console.log('selector-selectMessagesByChat by chatId');
            return messages.filter(message => message.chatId === selectedChatId);
        } else if (selectedChatLocalId) {
            console.log('selector-selectMessagesByChat by chatLocalId');
            return messages.filter(message => message.chatLocalId === selectedChatLocalId);
        }
        console.log('selector-selectMessagesByChat empty');
        return [];
    }
);

// Фильтрованные логи
export const selectFilteredLogs = createSelector(
    [selectLogs, selectFilterByModel, selectFilterByDateRange],
    (logs, filterByModel, filterByDateRange) => {
        let filteredLogs = [...logs];

        // Фильтр по модели
        if (filterByModel) {
            filteredLogs = filteredLogs.filter(log => log.modelName === filterByModel);
        }

        // Фильтр по дате
        if (filterByDateRange.start) {
            filteredLogs = filteredLogs.filter(log => 
                new Date(log.createdAt) >= new Date(filterByDateRange.start!)
            );
        }
        if (filterByDateRange.end) {
            filteredLogs = filteredLogs.filter(log => 
                new Date(log.createdAt) <= new Date(filterByDateRange.end!)
            );
        }

        return filteredLogs.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
);

// Выбранный лог
export const selectSelectedLog = createSelector(
    [selectLogs, selectSelectedLogId],
    (logs, selectedLogId) => {
        return selectedLogId ? logs.find(log => log.id === selectedLogId) : null;
    }
);

// Статистика по моделям
export const selectModelStatistics = createSelector(
    [selectLogs],
    (logs) => {
        const modelStats: Record<string, {
            count: number;
            averageResponseTime: number;
            averageQualityScore: number;
            totalTokens: number;
            userSatisfactionRate: number;
        }> = {};

        logs.forEach(log => {
            if (!modelStats[log.modelName]) {
                modelStats[log.modelName] = {
                    count: 0,
                    averageResponseTime: 0,
                    averageQualityScore: 0,
                    totalTokens: 0,
                    userSatisfactionRate: 0
                };
            }

            const stats = modelStats[log.modelName];
            stats.count++;
            stats.totalTokens += log.tokenCount;
        });

        // Расчет средних значений
        Object.keys(modelStats).forEach(modelName => {
            const stats = modelStats[modelName];
            const modelLogs = logs.filter(log => log.modelName === modelName);
            
            stats.averageResponseTime = modelLogs.reduce((sum, log) => sum + log.responseTime, 0) / stats.count;
            stats.averageQualityScore = modelLogs.reduce((sum, log) => sum + log.qualityScore, 0) / stats.count;
            
            const ratedLogs = modelLogs.filter(log => log.userRating !== null);
            const positiveRatings = ratedLogs.filter(log => log.userRating === 'like').length;
            stats.userSatisfactionRate = ratedLogs.length > 0 ? (positiveRatings / ratedLogs.length) * 100 : 0;
        });

        return modelStats;
    }
);
