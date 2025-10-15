import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../config/hooks';
import { selectModels, selectSelectedModelId } from '../store/selector/selectors';
import { selectMessagesByChat } from '../store/selector/selectors';
import { setSelectedModelId } from '../store/slice/modelSlice';
import { ContextService } from '../services/contextService';
import { ContextConfirmationModal } from './ContextConfirmationModal';
import type { Message } from '../entities';

interface ContextAwareLLMSelectorProps {
    currentPrompt: string;
    onModelSwitch: (modelId: string, mode: 'next-only' | 'entire-conversation') => void;
    isVisible: boolean;
    onClose: () => void;
}

export const ContextAwareLLMSelector: React.FC<ContextAwareLLMSelectorProps> = ({
    currentPrompt,
    onModelSwitch,
    isVisible,
    onClose
}) => {
    const dispatch = useAppDispatch();
    const models = useAppSelector(selectModels);
    const selectedModelId = useAppSelector(selectSelectedModelId);
    const messages = useAppSelector(selectMessagesByChat);
    
    const [selectedMode, setSelectedMode] = useState<'next-only' | 'entire-conversation'>('next-only');
    const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingModelId, setPendingModelId] = useState<string | null>(null);
    
    // Calculate token usage for current mode
    const tokenUsage = ContextService.calculateTokenUsage(messages, currentPrompt, selectedMode);
    
    // Calculate token usage for hovered model (if different mode)
    const hoveredTokenUsage = hoveredModelId ? 
        ContextService.calculateTokenUsage(messages, currentPrompt, selectedMode) : 
        null;

    const handleModelSelect = (modelId: string) => {
        if (modelId === selectedModelId) {
            onClose();
            return;
        }
        
        setPendingModelId(modelId);
        setShowConfirmation(true);
    };

    const handleConfirmSwitch = () => {
        if (pendingModelId) {
            dispatch(setSelectedModelId(pendingModelId));
            onModelSwitch(pendingModelId, selectedMode);
            setShowConfirmation(false);
            setPendingModelId(null);
            onClose();
        }
    };

    const handleCancelSwitch = () => {
        setShowConfirmation(false);
        setPendingModelId(null);
    };

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-96 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Switch LLM Model</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {/* Mode Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Context Mode
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="contextMode"
                                    value="next-only"
                                    checked={selectedMode === 'next-only'}
                                    onChange={(e) => setSelectedMode(e.target.value as 'next-only')}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Next prompt only</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="contextMode"
                                    value="entire-conversation"
                                    checked={selectedMode === 'entire-conversation'}
                                    onChange={(e) => setSelectedMode(e.target.value as 'entire-conversation')}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Entire conversation</span>
                            </label>
                        </div>
                    </div>

                    {/* Token Usage Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Estimated tokens:</span>
                            <span className="font-semibold text-gray-900">{tokenUsage.tokens.toLocaleString()}</span>
                        </div>
                        {selectedMode === 'entire-conversation' && (
                            <>
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span className="text-gray-600">Previous messages:</span>
                                    <span className="font-semibold text-gray-900">{tokenUsage.contextLength}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span className="text-gray-600">Estimated cost:</span>
                                    <span className="font-semibold text-green-600">${tokenUsage.cost.toFixed(4)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    model.id === selectedModelId
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => handleModelSelect(model.id)}
                                onMouseEnter={() => setHoveredModelId(model.id)}
                                onMouseLeave={() => setHoveredModelId(null)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">{model.name}</div>
                                        <div className="text-sm text-gray-500">{model.id}</div>
                                    </div>
                                    {model.id === selectedModelId && (
                                        <div className="text-blue-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ContextConfirmationModal
                isOpen={showConfirmation}
                onClose={handleCancelSwitch}
                onConfirm={handleConfirmSwitch}
                newModelName={models.find(m => m.id === pendingModelId)?.name || ''}
                mode={selectedMode}
                tokenCount={tokenUsage.tokens}
                estimatedCost={tokenUsage.cost}
                messageCount={tokenUsage.contextLength}
            />
        </>
    );
};
