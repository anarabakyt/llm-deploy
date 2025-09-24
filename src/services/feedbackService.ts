import { apiService } from './api';
import type { ModelResponse } from '../entities';

// Интерфейс для feedback ответа модели
interface ModelResponseFeedback {
  messageId: string;
  modelName: string;
  isLiked: boolean;
  isDisliked: boolean;
  feedbackCount: {
    likes: number;
    dislikes: number;
  };
}

// Интерфейс для параметров лайка/дизлайка
interface FeedbackParams {
  messageId: string;
  modelName: string;
}

class FeedbackService {
  /**
   * Поставить лайк ответу модели
   * @param messageId - ID сообщения
   * @param modelId - ID модели
   * @returns Promise с результатом операции
   */
  async likeModelResponse(messageId: string, modelName: string): Promise<ModelResponseFeedback> {
    try {
      await apiService.likeModelResponse(messageId, modelName);
      
      // Возвращаем обновленную информацию о feedback
      return {
        messageId,
        modelName,
        isLiked: true,
        isDisliked: false,
        feedbackCount: {
          likes: 1, // В реальном приложении это значение должно приходить с сервера
          dislikes: 0,
        },
      };
    } catch (error) {
      console.error('Error liking model response:', error);
      throw error;
    }
  }

  /**
   * Поставить дизлайк ответу модели
   * @param messageId - ID сообщения
   * @param modelId - ID модели
   * @returns Promise с результатом операции
   */
  async dislikeModelResponse(messageId: string, modelName: string): Promise<ModelResponseFeedback> {
    try {
      await apiService.dislikeModelResponse(messageId, modelName);
      
      // Возвращаем обновленную информацию о feedback
      return {
        messageId,
        modelName,
        isLiked: false,
        isDisliked: true,
        feedbackCount: {
          likes: 0,
          dislikes: 1, // В реальном приложении это значение должно приходить с сервера
        },
      };
    } catch (error) {
      console.error('Error disliking model response:', error);
      throw error;
    }
  }

  /**
   * Убрать лайк/дизлайк с ответа модели
   * @param messageId - ID сообщения
   * @param modelId - ID модели
   * @returns Promise с результатом операции
   */
  async removeModelResponseFeedback(messageId: string, modelName: string): Promise<ModelResponseFeedback> {
    try {
      await apiService.removeModelResponseFeedback(messageId, modelName);
      
      // Возвращаем обновленную информацию о feedback
      return {
        messageId,
        modelName,
        isLiked: false,
        isDisliked: false,
        feedbackCount: {
          likes: 0,
          dislikes: 0,
        },
      };
    } catch (error) {
      console.error('Error removing model response feedback:', error);
      throw error;
    }
  }

  /**
   * Получить информацию о feedback для ответа модели
   * @param messageId - ID сообщения
   * @param modelId - ID модели
   * @returns Promise с информацией о feedback
   */
  async getModelResponseFeedback(messageId: string, modelName: string): Promise<ModelResponseFeedback> {
    try {
      // В реальном приложении здесь должен быть GET запрос
      // Пока возвращаем дефолтные значения
      return {
        messageId,
        modelName,
        isLiked: false,
        isDisliked: false,
        feedbackCount: {
          likes: 0,
          dislikes: 0,
        },
      };
    } catch (error) {
      console.error('Error getting model response feedback:', error);
      throw error;
    }
  }

  /**
   * Переключить лайк (если уже лайкнуто - убрать, если не лайкнуто - поставить)
   * @param messageId - ID сообщения
   * @param modelId - ID модели
   * @param currentState - текущее состояние лайка
   * @returns Promise с результатом операции
   */
  async toggleLike(
    messageId: string, 
    modelName: string, 
    currentState: { isLiked: boolean; isDisliked: boolean }
  ): Promise<ModelResponseFeedback> {
    if (currentState.isLiked) {
      // Если уже лайкнуто, убираем лайк
      return this.removeModelResponseFeedback(messageId, modelName);
    } else if (currentState.isDisliked) {
      // Если дизлайкнуто, убираем дизлайк и ставим лайк
      await this.removeModelResponseFeedback(messageId, modelName);
      return this.likeModelResponse(messageId, modelName);
    } else {
      // Если ничего не поставлено, ставим лайк
      return this.likeModelResponse(messageId, modelName);
    }
  }

  /**
   * Переключить дизлайк (если уже дизлайкнуто - убрать, если не дизлайкнуто - поставить)
   * @param messageId - ID сообщения
   * @param modelId - ID модели
   * @param currentState - текущее состояние дизлайка
   * @returns Promise с результатом операции
   */
  async toggleDislike(
    messageId: string, 
    modelName: string, 
    currentState: { isLiked: boolean; isDisliked: boolean }
  ): Promise<ModelResponseFeedback> {
    if (currentState.isDisliked) {
      // Если уже дизлайкнуто, убираем дизлайк
      return this.removeModelResponseFeedback(messageId, modelName);
    } else if (currentState.isLiked) {
      // Если лайкнуто, убираем лайк и ставим дизлайк
      await this.removeModelResponseFeedback(messageId, modelName);
      return this.dislikeModelResponse(messageId, modelName);
    } else {
      // Если ничего не поставлено, ставим дизлайк
      return this.dislikeModelResponse(messageId, modelName);
    }
  }
}

export const feedbackService = new FeedbackService();
export type { ModelResponseFeedback, FeedbackParams };
