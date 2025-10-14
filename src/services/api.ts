import type {Chat, Message, Model, ModelResponse, User} from '../entities';

// Базовый URL для API (будет настраиваться через переменные окружения)
const API_BASE_URL = 'https://plus8soft.app.n8n.cloud/webhook/86dbcf57-9d9a-4b5a-98c9-bf37fad2e479';

// Интерфейс для ответа API
interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

// Интерфейс для ошибки API
interface ApiError {
    message: string;
    status: number;
    code?: string;
}

// Класс для работы с API
class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    // Установка токена авторизации
    setAuthToken(token: string | null) {
        this.token = token;
    }

    // Базовый метод для HTTP запросов
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message || `HTTP ${response.status}`,
                    response.status,
                    errorData.code
                );
            }

            const data = await response.json();
            return {
                data,
                success: true,
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                error instanceof Error ? error.message : 'Unknown error',
                0
            );
        }
    }

    // GET запрос
    private async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {method: 'GET'});
    }

    // POST запрос
    private async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PUT запрос
    private async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE запрос
    private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {method: 'DELETE'});
    }

    // Методы для работы с моделями
    async getModels(userId: string): Promise<Model[]> {
        const response = await this.get<any>(`/models/${userId}`);
        // Извлекаем модели из структуры ответа и конвертируем в правильный формат
        if (response.data && response.data.models && Array.isArray(response.data.models)) {
            return response.data.models.map((model: any) => ({
                id: model.id,
                name: model.name,
                modelUrl: model.model_url || '',
                isFixed: model.is_fixed,
                createdAt: model.created_at, // Оставляем как строку для сериализации
            }));
        }
        return [];
    }

    async getModelById(id: string): Promise<Model> {
        const response = await this.get<Model>(`/models/${id}`);
        return response.data;
    }

    // Методы для работы с чатами
    async getChats(userId: string): Promise<Chat[]> {
        const response = await this.get<any>(`/chats/${userId}`);
        // Извлекаем чаты из структуры ответа и конвертируем в правильный формат
        if (response.data && response.data.chats && Array.isArray(response.data.chats)) {
            return response.data.chats.map((chat: any) => ({
                id: chat.id,
                modelId: chat.model_id,
                localId: `chat_${chat.id}`, // Генерируем localId на основе id
                createdAt: chat.created_at, // Оставляем как строку для сериализации
            }));
        }
        return [];
    }

    async getChatById(id: string): Promise<Chat> {
        const response = await this.get<Chat>(`/chats/${id}`);
        return response.data;
    }

    async createChat(modelId: string, localId: string): Promise<Chat> {
        const response = await this.post<Chat>('/chats', {modelId, localId});
        return response.data;
    }

    async updateChat(id: string, updates: Partial<Chat>): Promise<Chat> {
        const response = await this.put<Chat>(`/chats/${id}`, updates);
        return response.data;
    }

    async deleteChat(id: string): Promise<void> {
        await this.delete(`/chats/${id}`);
    }

    // Методы для работы с сообщениями
    async getMessages(chatId: string): Promise<Message[]> {
        const response = await this.get<Message[]>(`/chats/${chatId}/messages`);
        return response.data;
    }

    async sendMessage(chatId: string, text: string): Promise<Message> {
        const response = await this.post<Message>(`/chats/${chatId}/messages`, {text});
        return response.data;
    }

    // Отправка сообщения к конкретной модели
    async sendMessageToModel(chatId: string, modelId: string, text: string): Promise<Message> {
        const response = await this.post<Message>(`/chats/${chatId}/messages`, {
            text,
            modelId
        });
        return response.data;
    }

    // Отправка сообщения ко всем моделям (для фиксированного чата)
    async sendMessageToAllModels(text: string): Promise<{ userMessage: Message; modelResponses: ModelResponse[] }> {
        const response = await this.post<{
            userMessage: Message;
            modelResponses: ModelResponse[]
        }>('/messages/broadcast', {text});
        return response.data;
    }

    // Методы для работы с пользователем
    async getCurrentUser(): Promise<User> {
        const response = await this.get<User>('/user/me');
        return response.data;
    }

    async updateUser(updates: Partial<User>): Promise<User> {
        const response = await this.put<User>('/user/me', updates);
        return response.data;
    }

    // Метод для авторизации через Firebase
    async authenticateWithFirebase(token: string): Promise<User> {
        const response = await this.post<User>('/auth/firebase', {token});
        return response.data;
    }

    // Методы для работы с лайками/дизлайками
    async likeModelResponse(messageId: string, modelName: string): Promise<void> {
        await this.post(`/messages/${messageId}/responses/${modelName}/like`);
    }

    async dislikeModelResponse(messageId: string, modelName: string): Promise<void> {
        await this.post(`/messages/${messageId}/responses/${modelName}/dislike`);
    }

    async removeModelResponseFeedback(messageId: string, modelName: string): Promise<void> {
        await this.delete(`/messages/${messageId}/responses/${modelName}/feedback`);
    }
        // Методы для работы с логами LLM запросов
        async createLog(log: any): Promise<any> {
            const response = await this.post<any>('/logs', log);
            return response.data;
        }
    
        async updateLog(logId: string, updates: any): Promise<any> {
            const response = await this.put<any>(`/logs/${logId}`, updates);
            return response.data;
        }
    
        async getLogs(userId: string, filters?: {
            modelName?: string;
            startDate?: string;
            endDate?: string;
            limit?: number;
        }): Promise<any[]> {
            const queryParams = new URLSearchParams();
            queryParams.append('userId', userId);
            
            if (filters?.modelName) queryParams.append('modelName', filters.modelName);
            if (filters?.startDate) queryParams.append('startDate', filters.startDate);
            if (filters?.endDate) queryParams.append('endDate', filters.endDate);
            if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    
            const response = await this.get<any[]>(`/logs?${queryParams.toString()}`);
            return response.data;
        }
    
        async getLogMetrics(userId: string): Promise<any> {
            const response = await this.get<any>(`/logs/metrics/${userId}`);
            return response.data;
        }
    
        async deleteLog(logId: string): Promise<void> {
            await this.delete(`/logs/${logId}`);
        }
    
        async exportLogs(userId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
            const response = await fetch(`${this.baseURL}/logs/export/${userId}?format=${format}`, {
                method: 'GET',
                headers: {
                    'Authorization': this.token ? `Bearer ${this.token}` : '',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
    
            return response.blob();
        }
}

// Класс для ошибок API
class ApiError extends Error {
    public status: number;
    public code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

// Экспорт экземпляра сервиса
export const apiService = new ApiService();
export {ApiError};
export type {ApiResponse};
