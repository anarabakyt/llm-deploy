import React from 'react';
import {useAppDispatch, useAppSelector} from '../config/hooks.ts';
import {selectAutoSelectionMode} from '../store/selector/selectors.ts';
import {setAutoSelectionMode, selectBestModel} from '../store/slice/modelSlice.ts';
import type {AutoSelectionMode} from '../store/slice/modelSlice.ts';

export const AutoSelectionModeSelector: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentMode = useAppSelector(selectAutoSelectionMode);

    const handleModeChange = (mode: AutoSelectionMode) => {
        dispatch(setAutoSelectionMode(mode));
        
        // If switching to auto mode, immediately select the best model
        if (mode !== 'manual') {
            dispatch(selectBestModel());
        }
    };

    const modes: { value: AutoSelectionMode; label: string; description: string }[] = [
        {
            value: 'manual',
            label: 'Manual',
            description: 'Choose LLM manually'
        },
        {
            value: 'best_quality',
            label: 'Best',
            description: 'Select the most expensive or best performing LLM for this task'
        },
        {
            value: 'token_efficient',
            label: 'Green',
            description: 'Select LLM that consumes least tokens (electricity)'
        },
       
    ];

    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">LLM Selection Mode</h3>
            <div className="space-y-2">
                {modes.map((mode) => (
                    <label key={mode.value} className="flex items-start space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="autoSelectionMode"
                            value={mode.value}
                            checked={currentMode === mode.value}
                            onChange={() => handleModeChange(mode.value)}
                            className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {mode.label}
                            </div>
                            <div className="text-xs text-gray-500">
                                {mode.description}
                            </div>
                        </div>
                    </label>
                ))}
            </div>
            
            {currentMode !== 'manual' && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Auto-selection is active. The system will choose the best LLM based on your selected criteria.
                    </div>
                </div>
            )}
        </div>
    );
};

