import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Model} from '../../entities';

interface ModelState {
    models: Model[];
    selectedModelId: string | null;
    selectedModelUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ModelState = {
    models: [],
    selectedModelId: null,
    selectedModelUrl: null,
    isLoading: false,
    error: null,
};

const modelSlice = createSlice({
    name: 'models',
    initialState,
    reducers: {
        setModels: (state, action: PayloadAction<Model[]>) => {
            state.isLoading = false;
            state.models = action.payload;
            state.error = null;
        },
        setSelectedModelId: (state, action: PayloadAction<string | null>) => {
            state.selectedModelId = action.payload;
            if (action.payload) {
                const selectedModel = state.models.find(m => m.id === action.payload);
                state.selectedModelUrl = selectedModel ? selectedModel.modelUrl : null;
            } else {
                state.selectedModelUrl = null;
            }
        }
    },
});

export const {
    setModels,
    setSelectedModelId
} = modelSlice.actions;

export default modelSlice.reducer;
