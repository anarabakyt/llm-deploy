import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Model } from '../entities';

interface ModelState {
  models: Model[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ModelState = {
  models: [],
  isLoading: false,
  error: null,
};

const modelSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    fetchModelsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchModelsSuccess: (state, action: PayloadAction<Model[]>) => {
      state.isLoading = false;
      state.models = action.payload;
      state.error = null;
    },
    fetchModelsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addModel: (state, action: PayloadAction<Model>) => {
      state.models.push(action.payload);
    },
    updateModel: (state, action: PayloadAction<Model>) => {
      const index = state.models.findIndex(model => model.id === action.payload.id);
      if (index !== -1) {
        state.models[index] = action.payload;
      }
    },
    removeModel: (state, action: PayloadAction<string>) => {
      state.models = state.models.filter(model => model.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchModelsStart,
  fetchModelsSuccess,
  fetchModelsFailure,
  addModel,
  updateModel,
  removeModel,
  clearError,
} = modelSlice.actions;

export default modelSlice.reducer;
