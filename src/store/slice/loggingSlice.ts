import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LLMRequestLog, LoggingMetrics } from '../../services/llmLoggingService';

interface LoggingState {
    logs: LLMRequestLog[];
    metrics: LoggingMetrics;
    isLoading: boolean;
    error: string | null;
    selectedLogId: string | null;
    filterByModel: string | null;
    filterByUser: string | null;
    filterByDateRange: {
        start: string | null;
        end: string | null;
    };
}

const initialState: LoggingState = {
    logs: [],
    metrics: {
        totalRequests: 0,
        averageResponseTime: 0,
        averageQualityScore: 0,
        totalTokensUsed: 0,
        userSatisfactionRate: 0
    },
    isLoading: false,
    error: null,
    selectedLogId: null,
    filterByModel: null,
    filterByUser: null,
    filterByDateRange: {
        start: null,
        end: null
    }
};

const loggingSlice = createSlice({
    name: 'logging',
    initialState,
    reducers: {
        // Добавление нового лога
        addLog: (state, action: PayloadAction<LLMRequestLog>) => {
            state.logs.unshift(action.payload);
        },

        // Обновление лога
        updateLog: (state, action: PayloadAction<{ id: string; updates: Partial<LLMRequestLog> }>) => {
            const { id, updates } = action.payload;
            const logIndex = state.logs.findIndex(log => log.id === id);
            if (logIndex !== -1) {
                state.logs[logIndex] = { ...state.logs[logIndex], ...updates };
            }
        },

        // Удаление лога
        removeLog: (state, action: PayloadAction<string>) => {
            state.logs = state.logs.filter(log => log.id !== action.payload);
        },

        // Установка логов
        setLogs: (state, action: PayloadAction<LLMRequestLog[]>) => {
            state.logs = action.payload;
        },

        // Обновление метрик
        updateMetrics: (state, action: PayloadAction<LoggingMetrics>) => {
            state.metrics = action.payload;
        },

        // Установка выбранного лога
        setSelectedLogId: (state, action: PayloadAction<string | null>) => {
            state.selectedLogId = action.payload;
        },

        // Фильтрация по модели
        setFilterByModel: (state, action: PayloadAction<string | null>) => {
            state.filterByModel = action.payload;
        },

        // Фильтрация по пользователю
        setFilterByUser: (state, action: PayloadAction<string | null>) => {
            state.filterByUser = action.payload;
        },

        // Фильтрация по дате
        setFilterByDateRange: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
            state.filterByDateRange = action.payload;
        },

        // Очистка фильтров
        clearFilters: (state) => {
            state.filterByModel = null;
            state.filterByUser = null;
            state.filterByDateRange = { start: null, end: null };
        },

        // Установка состояния загрузки
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Установка ошибки
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Обновление пользовательской оценки
        updateUserRating: (state, action: PayloadAction<{ logId: string; rating: 'like' | 'dislike' | null }>) => {
            const { logId, rating } = action.payload;
            const log = state.logs.find(l => l.id === logId);
            if (log) {
                log.userRating = rating;
            }
        },

        // Очистка всех логов
        clearLogs: (state) => {
            state.logs = [];
            state.metrics = {
                totalRequests: 0,
                averageResponseTime: 0,
                averageQualityScore: 0,
                totalTokensUsed: 0,
                userSatisfactionRate: 0
            };
        }
    }
});

export const {
    addLog,
    updateLog,
    removeLog,
    setLogs,
    updateMetrics,
    setSelectedLogId,
    setFilterByModel,
    setFilterByUser,
    setFilterByDateRange,
    clearFilters,
    setLoading,
    setError,
    updateUserRating,
    clearLogs
} = loggingSlice.actions;

export default loggingSlice.reducer;