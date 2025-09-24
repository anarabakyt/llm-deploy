import { apiService } from './api';
import type { Message, ModelResponse } from '../entities';

// Интерфейс для ответа от модели
interface ModelResponseData {
  modelName: string;
  content: string;
  responseTime: number;
}

// Интерфейс для ответа API при отправке сообщения
interface SendMessageResponse {
  userMessage: Message;
  modelResponse?: ModelResponseData;
  modelResponses?: ModelResponseData[]; // Для broadcast
}

class MessageService {
  /**
   * Отправка сообщения к конкретной модели
   * @param chatId - ID чата
   * @param modelId - ID модели
   * @param text - Текст сообщения
   * @returns Promise с сообщением пользователя и ответом модели
   */
  async sendMessageToModel(
    chatId: string, 
    modelId: string, 
    text: string
  ): Promise<{ userMessage: Message; modelResponse?: ModelResponse }> {
    try {
      const response = await apiService.sendMessageToModel(chatId, modelId, text);
      
      // Преобразуем ответ в нужный формат
      const userMessage: Message = {
        id: response.id,
        chatId: response.chatId,
        author: response.author,
        content: response.content,
        createdAt: response.createdAt,
      };

      // Если есть ответ модели, добавляем его
      let modelResponse: ModelResponse | undefined;
      if (response.modelResponses && response.modelResponses.length > 0) {
        const modelResp = response.modelResponses[0];
        modelResponse = {
          messageId: userMessage.id || '',
          modelName: modelResp.modelName,
          content: modelResp.content,
          responseTime: modelResp.responseTime,
        };
      }

      return { userMessage, modelResponse };
    } catch (error) {
      console.error('Error sending message to model:', error);
      throw error;
    }
  }

  /**
   * Отправка сообщения ко всем моделям (для фиксированного чата)
   * @param text - Текст сообщения
   * @returns Promise с сообщением пользователя и ответами всех моделей
   */
  async sendMessageToAllModels(
    text: string
  ): Promise<{ userMessage: Message; modelResponses: ModelResponse[] }> {
    try {
      const response = await apiService.sendMessageToAllModels(text);
      
      // Преобразуем ответ в нужный формат
      const userMessage: Message = {
        id: response.userMessage.id,
        chatId: response.userMessage.chatId,
        author: response.userMessage.author,
        content: response.userMessage.content,
        createdAt: response.userMessage.createdAt,
      };

      // Преобразуем ответы моделей
      const modelResponses: ModelResponse[] = response.modelResponses?.map(resp => ({
        messageId: userMessage.id || '',
        modelName: resp.modelName,
        content: resp.content,
        responseTime: resp.responseTime,
      })) || [];

      return { userMessage, modelResponses };
    } catch (error) {
      console.error('Error sending message to all models:', error);
      throw error;
    }
  }

  /**
   * Получение сообщений чата
   * @param chatId - ID чата
   * @returns Promise с массивом сообщений
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    try {
      return await apiService.getMessages(chatId);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  /**
   * Создание нового сообщения (локально, без отправки на сервер)
   * @param chatId - ID чата
   * @param text - Текст сообщения
   * @param author - Автор сообщения
   * @returns Новое сообщение
   */
  createLocalMessage(
    chatId: string, 
    content: string, 
    author: 'user' | 'model' = 'user'
  ): Message {
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      author,
      content,
      createdAt: new Date(),
    };
  }

  /**
   * Обновление сообщения
   * @param message - Сообщение для обновления
   * @param updates - Обновления
   * @returns Обновленное сообщение
   */
  updateMessage(message: Message, updates: Partial<Message>): Message {
    return {
      ...message,
      ...updates,
    };
  }
}

export const messageService = new MessageService();
