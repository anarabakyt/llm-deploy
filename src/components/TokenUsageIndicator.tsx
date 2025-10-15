import React from 'react';

interface TokenUsageIndicatorProps {
    tokenCount: number;
    estimatedCost: number;
    messageCount?: number;
    mode: 'next-only' | 'entire-conversation';
    className?: string;
}

export const TokenUsageIndicator: React.FC<TokenUsageIndicatorProps> = ({
    tokenCount,
    estimatedCost,
    messageCount,
    mode,
    className = ''
}) => {
    return (
        <div className={`flex items-center space-x-4 text-xs text-gray-500 ${className}`}>
            <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 9h6m-6 4h6m-6 4h6" />
                </svg>
                <span>{tokenCount.toLocaleString()} tokens</span>
            </div>
            
            {mode === 'entire-conversation' && messageCount && (
                <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{messageCount} messages</span>
                </div>
            )}
            
            <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>${estimatedCost.toFixed(4)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                    mode === 'entire-conversation' ? 'bg-orange-400' : 'bg-green-400'
                }`} />
                <span className="capitalize">{mode.replace('-', ' ')}</span>
            </div>
        </div>
    );
};
