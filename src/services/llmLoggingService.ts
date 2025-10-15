import type { User, Message, ModelResponse } from '../entities';
import { TokenEstimationService } from './tokenEstimationService';
import { ModelScoringService } from './modelScoringService';

export interface LLMRequestLog {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    prompt: string;
    promptTime: string;
    responseTime: number;
    llmResponse: string;
    modelName: string;
    tokenCount: number;
    qualityScore: number;
    userRating?: 'like' | 'dislike' | null;
    chatId: string;
    createdAt: string;
}

export interface LoggingMetrics {
    totalRequests: number;
    averageResponseTime: number;
    averageQualityScore: number;
    totalTokensUsed: number;
    userSatisfactionRate: number;
}

export class LLMLoggingService {
    private static logs: LLMRequestLog[] = [];
    private static readonly STORAGE_KEY = 'llm_request_logs';

    /**
     * Логирование запроса к LLM
     */
    static logRequest({
        userId,
        userName,
        userEmail,
        userAvatar,
        prompt,
        response,
        modelName,
        chatId,
        userRating
    }: {
        userId: string;
        userName: string;
        userEmail: string;
        userAvatar?: string;
        prompt: string;
        response: ModelResponse;
        modelName: string;
        chatId: string;
        userRating?: 'like' | 'dislike' | null;
    }): LLMRequestLog {
        const log: LLMRequestLog = {
            id: this.generateLogId(),
            userId,
            userName,
            userEmail,
            userAvatar,
            prompt,
            promptTime: new Date().toISOString(),
            responseTime: response.responseTime,
            llmResponse: response.content,
            modelName,
            tokenCount: TokenEstimationService.estimateTokens(response.content),
            qualityScore: ModelScoringService.calculateQualityScore(response),
            userRating: userRating || null,
            chatId,
            createdAt: new Date().toISOString()
        };

        this.logs.push(log);
        this.saveLogsToStorage();
        this.sendLogToServer(log);

        return log;
    }

    /**
     * Обновление пользовательской оценки
     */
    static updateUserRating(logId: string, rating: 'like' | 'dislike' | null): void {
        const log = this.logs.find(l => l.id === logId);
        if (log) {
            log.userRating = rating;
            this.saveLogsToStorage();
            this.updateLogOnServer(logId, { userRating: rating });
        }
    }

    /**
     * Получение логов пользователя
     */
    static getUserLogs(userId: string, limit?: number): LLMRequestLog[] {
        const userLogs = this.logs
            .filter(log => log.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return limit ? userLogs.slice(0, limit) : userLogs;
    }

    /**
     * Получение метрик
     */
    static getMetrics(userId?: string): LoggingMetrics {
        const logs = userId ? this.logs.filter(log => log.userId === userId) : this.logs;
        
        if (logs.length === 0) {
            return {
                totalRequests: 0,
                averageResponseTime: 0,
                averageQualityScore: 0,
                totalTokensUsed: 0,
                userSatisfactionRate: 0
            };
        }

        const totalRequests = logs.length;
        const averageResponseTime = logs.reduce((sum, log) => sum + log.responseTime, 0) / totalRequests;
        const averageQualityScore = logs.reduce((sum, log) => sum + log.qualityScore, 0) / totalRequests;
        const totalTokensUsed = logs.reduce((sum, log) => sum + log.tokenCount, 0);
        
        const ratedLogs = logs.filter(log => log.userRating !== null);
        const positiveRatings = ratedLogs.filter(log => log.userRating === 'like').length;
        const userSatisfactionRate = ratedLogs.length > 0 ? (positiveRatings / ratedLogs.length) * 100 : 0;

        return {
            totalRequests,
            averageResponseTime: Math.round(averageResponseTime),
            averageQualityScore: Math.round(averageQualityScore * 100) / 100,
            totalTokensUsed,
            userSatisfactionRate: Math.round(userSatisfactionRate * 100) / 100
        };
    }

    /**
     * Получение логов по модели
     */
    static getModelLogs(modelName: string, userId?: string): LLMRequestLog[] {
        let logs = this.logs.filter(log => log.modelName === modelName);
        if (userId) {
            logs = logs.filter(log => log.userId === userId);
        }
        return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    /**
     * Экспорт логов в JSON
     */
    static exportLogs(userId?: string): string {
        const logs = userId ? this.getUserLogs(userId) : this.logs;
        return JSON.stringify(logs, null, 2);
    }

    /**
     * Очистка старых логов
     */
    static cleanupOldLogs(daysToKeep: number = 30): void {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        this.logs = this.logs.filter(log => 
            new Date(log.createdAt) > cutoffDate
        );
        
        this.saveLogsToStorage();
    }

    /**
     * Получение уникальных пользователей
     */
    static getUniqueUsers(): Array<{userId: string, userName: string, userEmail: string, userAvatar?: string}> {
        const userMap = new Map();
        this.logs.forEach(log => {
            if (!userMap.has(log.userId)) {
                userMap.set(log.userId, {
                    userId: log.userId,
                    userName: log.userName,
                    userEmail: log.userEmail,
                    userAvatar: log.userAvatar
                });
            }
        });
        return Array.from(userMap.values());
    }

    /**
     * Получение статистики по пользователям
     */
    static getUserStatistics(): Array<{
        userId: string;
        userName: string;
        userEmail: string;
        userAvatar?: string;
        totalRequests: number;
        averageResponseTime: number;
        averageQualityScore: number;
        totalTokens: number;
        userSatisfactionRate: number;
        lastActivity: string;
        favoriteModel: string;
    }> {
        const userStats = new Map();
        
        this.logs.forEach(log => {
            if (!userStats.has(log.userId)) {
                userStats.set(log.userId, {
                    userId: log.userId,
                    userName: log.userName,
                    userEmail: log.userEmail,
                    userAvatar: log.userAvatar,
                    requests: [],
                    modelUsage: new Map(),
                    lastActivity: log.createdAt
                });
            }
            
            const user = userStats.get(log.userId);
            user.requests.push(log);
            user.modelUsage.set(log.modelName, (user.modelUsage.get(log.modelName) || 0) + 1);
            
            if (new Date(log.createdAt) > new Date(user.lastActivity)) {
                user.lastActivity = log.createdAt;
            }
        });

        return Array.from(userStats.values()).map(user => {
            const totalRequests = user.requests.length;
            const averageResponseTime = user.requests.reduce((sum: number, log: LLMRequestLog) => sum + log.responseTime, 0) / totalRequests;
            const averageQualityScore = user.requests.reduce((sum: number, log: LLMRequestLog) => sum + log.qualityScore, 0) / totalRequests;
            const totalTokens = user.requests.reduce((sum: number, log: LLMRequestLog) => sum + log.tokenCount, 0);
            
            const ratedLogs = user.requests.filter((log: LLMRequestLog) => log.userRating !== null);
            const positiveRatings = ratedLogs.filter((log: LLMRequestLog) => log.userRating === 'like').length;
            const userSatisfactionRate = ratedLogs.length > 0 ? (positiveRatings / ratedLogs.length) * 100 : 0;
            
            const modelUsageArray = Array.from(user.modelUsage.entries()) as [string, number][];
            const favoriteModel = modelUsageArray.length > 0 
                ? modelUsageArray.sort((a, b) => b[1] - a[1])[0][0] 
                : 'Unknown';

            return {
                userId: user.userId,
                userName: user.userName,
                userEmail: user.userEmail,
                userAvatar: user.userAvatar,
                totalRequests,
                averageResponseTime: Math.round(averageResponseTime),
                averageQualityScore: Math.round(averageQualityScore * 100) / 100,
                totalTokens,
                userSatisfactionRate: Math.round(userSatisfactionRate * 100) / 100,
                lastActivity: user.lastActivity,
                favoriteModel
            };
        }).sort((a, b) => b.totalRequests - a.totalRequests);
    }

    /**
     * Генерация уникального ID для лога
     */
    private static generateLogId(): string {
        return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Сохранение логов в localStorage
     */
    private static saveLogsToStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
        } catch (error) {
            console.error('Ошибка сохранения логов в localStorage:', error);
        }
    }

    /**
     * Загрузка логов из localStorage
     */
    static loadLogsFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Ошибка загрузки логов из localStorage:', error);
        }
    }

    /**
     * Отправка лога на сервер
     */
    private static async sendLogToServer(log: LLMRequestLog): Promise<void> {
        try {
            const response = await fetch('/api/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(log)
            });

            if (!response.ok) {
                console.error('Ошибка отправки лога на сервер:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка отправки лога на сервер:', error);
        }
    }

    /**
     * Обновление лога на сервере
     */
    private static async updateLogOnServer(logId: string, updates: Partial<LLMRequestLog>): Promise<void> {
        try {
            const response = await fetch(`/api/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479/logs/${logId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                console.error('Ошибка обновления лога на сервере:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка обновления лога на сервере:', error);
        }
    }
}