import React from 'react';

interface ContextConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    newModelName: string;
    mode: 'next-only' | 'entire-conversation';
    tokenCount: number;
    estimatedCost: number;
    messageCount: number;
}

export const ContextConfirmationModal: React.FC<ContextConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    newModelName,
    mode,
    tokenCount,
    estimatedCost,
    messageCount
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                        Switch to {newModelName}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Mode:</span>
                            <span className="text-sm text-gray-900">
                                {mode === 'next-only' ? 'Next prompt only' : 'Entire conversation'}
                            </span>
                        </div>
                        
                        {mode === 'entire-conversation' && (
                            <>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">Previous messages:</span>
                                    <span className="text-sm text-blue-900 font-semibold">{messageCount}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">Estimated tokens:</span>
                                    <span className="text-sm text-yellow-900 font-semibold">{tokenCount.toLocaleString()}</span>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">Estimated cost:</span>
                                    <span className="text-sm text-green-900 font-semibold">${estimatedCost.toFixed(4)}</span>
                                </div>
                            </>
                        )}
                        
                        {mode === 'next-only' && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Estimated tokens:</span>
                                <span className="text-sm text-gray-900">{tokenCount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    
                    {mode === 'entire-conversation' && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex">
                                <svg className="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-amber-800">
                                    Switching to entire conversation mode will send all previous messages to the new model, which may increase token usage and costs.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Confirm Switch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
