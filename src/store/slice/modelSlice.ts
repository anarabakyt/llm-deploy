import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Model} from '../../entities';

export type AutoSelectionMode = 'manual' | 'best_quality' | 'token_efficient' ;

interface ModelState {
    models: Model[];
    selectedModelId: string | null;
    selectedModelUrl: string | null;
    isLoading: boolean;
    error: string | null;
    autoSelectionMode: AutoSelectionMode;
    modelScores: Record<string, { quality: number; tokenEfficiency: number; responseTime: number }>;
}

const initialState: ModelState = {
    models: [],
    selectedModelId: null,
    selectedModelUrl: null,
    isLoading: false,
    error: null,
    autoSelectionMode: 'manual',
    modelScores: {},
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
        },
        setAutoSelectionMode: (state, action: PayloadAction<AutoSelectionMode>) => {
            state.autoSelectionMode = action.payload;
        },
        updateModelScore: (state, action: PayloadAction<{
            modelId: string;
            quality: number;
            tokenEfficiency: number;
            responseTime: number;
        }>) => {
            const { modelId, quality, tokenEfficiency, responseTime } = action.payload;
            state.modelScores[modelId] = { quality, tokenEfficiency, responseTime };
        },
        selectBestModel: (state) => {
            if (state.autoSelectionMode === 'manual' || state.models.length === 0) {
                return;
            }

            let bestModelId: string | null = null;
            let bestScore = -1;

            for (const model of state.models) {
                const scores = state.modelScores[model.id];
                if (!scores) continue;

                let score = 0;
                if (state.autoSelectionMode === 'best_quality') {
                    score = scores.quality;
                } else if (state.autoSelectionMode === 'token_efficient') {
                    // Higher token efficiency = better score
                    score = scores.tokenEfficiency;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestModelId = model.id;
                }
            }

            if (bestModelId) {
                state.selectedModelId = bestModelId;
                const selectedModel = state.models.find(m => m.id === bestModelId);
                state.selectedModelUrl = selectedModel ? selectedModel.modelUrl : null;
            }
        }
    },
});

export const {
    setModels,
    setSelectedModelId,
    setAutoSelectionMode,
    updateModelScore,
    selectBestModel
} = modelSlice.actions;

export default modelSlice.reducer;
