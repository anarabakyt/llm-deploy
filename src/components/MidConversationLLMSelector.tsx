import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../config/hooks.ts';
import {selectModels, selectSelectedModelId} from '../store/selector/selectors.ts';
import {setSelectedModelId} from '../store/slice/modelSlice';
import {TokenEstimationService} from '../services/tokenEstimationService.ts';
import type {Message} from '../entities';

interface MidConversationLLMSelectorProps {
    messages: Message[];
    onModelChange: (modelId: string, scope: 'next' | 'conversation') => void;
    onClose: () => void;
}

export const MidConversationLLMSelector: React.FC<MidConversationLLMSelectorProps> = ({
    messages,
    onModelChange,
    onClose
}) => {
    const dispatch = useAppDispatch();
    const models = useAppSelector(selectModels);
    const currentModelId = useAppSelector(selectSelectedModelId);
    const [selectedModelId, setSelectedModelId] = useState<string>(currentModelId || '');
    const [scope, setScope] = useState<'next' | 'conversation'>('next');
    const [showTokenEstimation, setShowTokenEstimation] = useState(false);

    const handleModelSelect = (modelId: string) => {
        setSelectedModelId(modelId);
    };

    const handleScopeChange = (newScope: 'next' | 'conversation') => {
        setScope(newScope);
        if (newScope === 'conversation') {
            setShowTokenEstimation(true);
        } else {
            setShowTokenEstimation(false);
        }
    };

    const handleConfirm = () => {
        if (selectedModelId) {
            dispatch(setSelectedModelId(selectedModelId) as any);
            onModelChange(selectedModelId, scope);
            onClose();
        }
    };

    const tokenEstimation = showTokenEstimation && scope === 'conversation' 
        ? TokenEstimationService.estimateContextTokens(messages)
        : null;

    const truncationSuggestion = tokenEstimation 
        ? TokenEstimationService.suggestTruncationStrategy(messages)
        : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Switch LLM Mid-Conversation
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Scope Selection */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Scope:</h4>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="scope"
                                    value="next"
                                    checked={scope === 'next'}
                                    onChange={() => handleScopeChange('next')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Next prompt only
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Use selected LLM for the next message only
                                    </div>
                                </div>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="scope"
                                    value="conversation"
                                    checked={scope === 'conversation'}
                                    onChange={() => handleScopeChange('conversation')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Entire conversation
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Transfer context and use selected LLM for all future messages
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Select LLM:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {models.map((model) => (
                                <label key={model.id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="model"
                                        value={model.id}
                                        checked={selectedModelId === model.id}
                                        onChange={() => handleModelSelect(model.id)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {model.name}
                                        </div>
                                        {model.id === currentModelId && (
                                            <div className="text-xs text-blue-600">
                                                Current model
                                            </div>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Token Estimation */}
                    {tokenEstimation && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">
                                Context Transfer Analysis
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Total estimated tokens:</span>
                                    <span className="font-medium text-blue-900">
                                        {TokenEstimationService.formatTokenCount(tokenEstimation.totalTokens)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">User messages:</span>
                                    <span className="text-blue-900">
                                        {TokenEstimationService.formatTokenCount(tokenEstimation.breakdown.userMessages)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Model responses:</span>
                                    <span className="text-blue-900">
                                        {TokenEstimationService.formatTokenCount(tokenEstimation.breakdown.modelResponses)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">System overhead:</span>
                                    <span className="text-blue-900">
                                        {TokenEstimationService.formatTokenCount(tokenEstimation.breakdown.systemTokens)}
                                    </span>
                                </div>
                                
                                {truncationSuggestion?.shouldTruncate && (
                                    <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
                                        <div className="font-medium">⚠️ Context may be too large</div>
                                        <div className="mt-1">
                                            Consider keeping only the last {truncationSuggestion.keepRecentMessages} messages
                                            ({TokenEstimationService.formatTokenCount(truncationSuggestion.estimatedTokensAfterTruncation)})
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedModelId}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {scope === 'next' ? 'Switch for Next Prompt' : 'Switch for Entire Conversation'}
                    </button>
                </div>
            </div>
        </div>
    );
};
