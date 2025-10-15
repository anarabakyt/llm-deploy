import React from 'react';

interface ContextModeToggleProps {
    mode: 'next-only' | 'entire-conversation';
    onModeChange: (mode: 'next-only' | 'entire-conversation') => void;
    tokenCount: number;
    estimatedCost: number;
    messageCount?: number;
    className?: string;
}

export const ContextModeToggle: React.FC<ContextModeToggleProps> = ({
    mode,
    onModeChange,
    tokenCount,
    estimatedCost,
    messageCount,
    className = ''
}) => {
    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-3 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Context Mode</span>
                <div className="flex bg-gray-100 rounded-md p-1">
                    <button
                        onClick={() => onModeChange('next-only')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            mode === 'next-only'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Next Only
                    </button>
                    <button
                        onClick={() => onModeChange('entire-conversation')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            mode === 'entire-conversation'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Full Context
                    </button>
                </div>
            </div>
            
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Tokens:</span>
                    <span className="font-medium text-gray-900">{tokenCount.toLocaleString()}</span>
                </div>
                
                {mode === 'entire-conversation' && messageCount && (
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Messages:</span>
                        <span className="font-medium text-gray-900">{messageCount}</span>
                    </div>
                )}
                
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Cost:</span>
                    <span className="font-medium text-green-600">${estimatedCost.toFixed(4)}</span>
                </div>
            </div>
            
            {mode === 'entire-conversation' && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    <div className="flex items-start">
                        <svg className="w-4 h-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Sending full conversation history to the model</span>
                    </div>
                </div>
            )}
        </div>
    );
};
