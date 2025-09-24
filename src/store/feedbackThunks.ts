import { createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackService } from '../services/feedbackService';
import type { ModelResponseFeedback, FeedbackParams } from '../services/feedbackService';
import type { RootState } from './index';

/**
 * Thunk для лайка ответа модели
 */
export const likeModelResponse = createAsyncThunk<
  ModelResponseFeedback,
  FeedbackParams,
  { state: RootState }
>(
  'feedback/likeModelResponse',
  async ({ messageId, modelName }, { rejectWithValue }) => {
    try {
      const result = await feedbackService.likeModelResponse(messageId, modelName);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to like model response'
      );
    }
  }
);

/**
 * Thunk для дизлайка ответа модели
 */
export const dislikeModelResponse = createAsyncThunk<
  ModelResponseFeedback,
  FeedbackParams,
  { state: RootState }
>(
  'feedback/dislikeModelResponse',
  async ({ messageId, modelName }, { rejectWithValue }) => {
    try {
      const result = await feedbackService.dislikeModelResponse(messageId, modelName);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to dislike model response'
      );
    }
  }
);

/**
 * Thunk для удаления лайка/дизлайка с ответа модели
 */
export const removeModelResponseFeedback = createAsyncThunk<
  ModelResponseFeedback,
  FeedbackParams,
  { state: RootState }
>(
  'feedback/removeModelResponseFeedback',
  async ({ messageId, modelName }, { rejectWithValue }) => {
    try {
      const result = await feedbackService.removeModelResponseFeedback(messageId, modelName);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to remove model response feedback'
      );
    }
  }
);

/**
 * Thunk для переключения лайка
 */
export const toggleLike = createAsyncThunk<
  ModelResponseFeedback,
  FeedbackParams & { currentState: { isLiked: boolean; isDisliked: boolean } },
  { state: RootState }
>(
  'feedback/toggleLike',
  async ({ messageId, modelName, currentState }, { rejectWithValue }) => {
    try {
      const result = await feedbackService.toggleLike(messageId, modelName, currentState);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to toggle like'
      );
    }
  }
);

/**
 * Thunk для переключения дизлайка
 */
export const toggleDislike = createAsyncThunk<
  ModelResponseFeedback,
  FeedbackParams & { currentState: { isLiked: boolean; isDisliked: boolean } },
  { state: RootState }
>(
  'feedback/toggleDislike',
  async ({ messageId, modelName, currentState }, { rejectWithValue }) => {
    try {
      const result = await feedbackService.toggleDislike(messageId, modelName, currentState);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to toggle dislike'
      );
    }
  }
);
