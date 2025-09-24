import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ModelResponseFeedback } from '../services/feedbackService';
import { 
  likeModelResponse, 
  dislikeModelResponse, 
  removeModelResponseFeedback,
  toggleLike,
  toggleDislike 
} from './feedbackThunks';

interface FeedbackState {
  feedbacks: Record<string, ModelResponseFeedback>; // key: "messageId-modelName"
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: {},
  isLoading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAllFeedback: (state) => {
      state.feedbacks = {};
    },
    // Локальное обновление feedback (для оптимистичных обновлений)
    updateFeedback: (state, action: PayloadAction<ModelResponseFeedback>) => {
      const key = `${action.payload.messageId}-${action.payload.modelName}`;
      state.feedbacks[key] = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Обработка likeModelResponse
    builder
      .addCase(likeModelResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeModelResponse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const key = `${action.payload.messageId}-${action.payload.modelName}`;
        state.feedbacks[key] = action.payload;
      })
      .addCase(likeModelResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка dislikeModelResponse
    builder
      .addCase(dislikeModelResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(dislikeModelResponse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const key = `${action.payload.messageId}-${action.payload.modelName}`;
        state.feedbacks[key] = action.payload;
      })
      .addCase(dislikeModelResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка removeModelResponseFeedback
    builder
      .addCase(removeModelResponseFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeModelResponseFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const key = `${action.payload.messageId}-${action.payload.modelName}`;
        state.feedbacks[key] = action.payload;
      })
      .addCase(removeModelResponseFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка toggleLike
    builder
      .addCase(toggleLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const key = `${action.payload.messageId}-${action.payload.modelName}`;
        state.feedbacks[key] = action.payload;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка toggleDislike
    builder
      .addCase(toggleDislike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleDislike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const key = `${action.payload.messageId}-${action.payload.modelName}`;
        state.feedbacks[key] = action.payload;
      })
      .addCase(toggleDislike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearAllFeedback,
  updateFeedback,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
