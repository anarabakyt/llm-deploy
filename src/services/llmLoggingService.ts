import type { User, Message, ModelResponse } from '../entities';
import { TokenEstimationService } from './tokenEstimationService';
import { ModelScoringService } from './modelScoringService';

export interface LLMRequestLog {
    id: string;
    userId: string;
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
        prompt,
        response,
        modelName,
        chatId,
        userRating
    }: {
        userId: string;
        prompt: string;
        response: ModelResponse;
        modelName: string;
        chatId: string;
        userRating?: 'like' | 'dislike' | null;
    }): LLMRequestLog {
        const log: LLMRequestLog = {
            id: this.generateLogId(),
            userId,
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